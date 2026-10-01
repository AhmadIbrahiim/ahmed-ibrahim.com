// The only module that imports livekit-client. AgentDock loads it with import() on the first
// click, so none of this is in the page's first load.
import { ParticipantKind, Room, RoomEvent, Track } from "livekit-client";

const SLOW_START_MS = 5000; // tell the visitor the agent is waking up
const GIVE_UP_MS = 45000;

const NOOP = { end() {}, setMuted() {}, sendText() {}, startAudio() {} };
const isAgent = p => p && p.kind === ParticipantKind.AGENT;

// Smoothed 0..1 level of a MediaStreamTrack, polled by `onLevel` ~every frame.
function meter(ctx, mediaStreamTrack) {
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.55;
  const source = ctx.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
  source.connect(analyser);
  const data = new Uint8Array(analyser.fftSize);
  return {
    read() {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      return Math.min(1, Math.sqrt(sum / data.length) * 3.5);
    },
    stop() {
      source.disconnect();
    }
  };
}

/**
 * Starts a voice session with the site's agent. Callbacks:
 *  onState(s)    agent state: connecting | idle | listening | thinking | speaking
 *  onMessage(m)  { id, role: 'user' | 'agent', text } (same id again = updated text)
 *  onSlow()      the agent is taking a while to join (cold start)
 *  onNavigate(p) the agent asked to open a same-site path
 *  onEnd(why)    session over: 'ended' | 'error' | 'mic-blocked'
 *  onAudioBlocked(bool)  the browser is blocking playback until the visitor taps
 *  audioContext  created inside the click handler so Safari lets audio play
 *  onLevel(n)    live audio level 0..1 for the Aura, ~every frame
 * Returns { end, setMuted, sendText, startAudio }.
 */
export default async function startSession({
  onState,
  onMessage,
  onSlow,
  onNavigate,
  onEnd,
  onAudioBlocked,
  audioContext,
  onLevel
}) {
  const res = await fetch("/api/token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}"
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const { server_url: url, participant_token: token } = await res.json();

  const room = new Room({ adaptiveStream: false, dynacast: false });
  const audioEls = [];
  const meters = { agent: null, user: null };
  let ctx = audioContext || null;
  let agentState = "connecting";
  let finished = false;
  let raf = 0;
  let slowTimer = 0;
  let giveUpTimer = 0;

  const audioCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const finish = why => {
    if (finished) return;
    finished = true;
    window.cancelAnimationFrame(raf);
    window.clearTimeout(slowTimer);
    window.clearTimeout(giveUpTimer);
    if (meters.agent) meters.agent.stop();
    if (meters.user) meters.user.stop();
    audioEls.forEach(el => el.remove());
    if (ctx) ctx.close().catch(() => {});
    onLevel(0);
    room.disconnect();
    onEnd(why);
  };

  // Level: the agent's voice while it speaks, the visitor's while the agent listens.
  const tick = () => {
    const m = agentState === "speaking" ? meters.agent : meters.user;
    onLevel(m ? m.read() : 0);
    raf = window.requestAnimationFrame(tick);
  };

  slowTimer = window.setTimeout(() => {
    if (!finished && agentState === "connecting") onSlow();
  }, SLOW_START_MS);
  giveUpTimer = window.setTimeout(() => {
    if (!finished && agentState === "connecting") finish("error");
  }, GIVE_UP_MS);

  const setAgentState = s => {
    if (!s) return;
    agentState = s === "initializing" ? "connecting" : s;
    onState(agentState);
  };
  room.on(RoomEvent.ParticipantAttributesChanged, (changed, participant) => {
    if (isAgent(participant) && "lk.agent.state" in changed) setAgentState(changed["lk.agent.state"]);
  });
  // The state can already be set when the agent joins, with no change event after it.
  room.on(RoomEvent.ParticipantConnected, participant => {
    if (isAgent(participant)) setAgentState(participant.attributes["lk.agent.state"]);
  });

  room.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
    if (track.kind !== Track.Kind.Audio || !isAgent(participant)) return;
    const el = track.attach(); // an <audio> element; needs to be in the DOM to play
    document.body.appendChild(el);
    audioEls.push(el);
    meters.agent = meter(audioCtx(), track.mediaStreamTrack);
  });

  room.on(RoomEvent.ParticipantDisconnected, participant => {
    // The agent hangs up itself when the time cap is reached.
    if (isAgent(participant)) finish("ended");
  });
  room.on(RoomEvent.Disconnected, () => finish("ended"));
  room.on(RoomEvent.AudioPlaybackStatusChanged, () => onAudioBlocked(!room.canPlaybackAudio));

  // Captions: agent speech streams in chunks; the visitor's arrives as whole updates.
  room.registerTextStreamHandler("lk.transcription", async (reader, info) => {
    const id = (reader.info.attributes && reader.info.attributes["lk.segment_id"]) || reader.info.id;
    const role = info.identity === room.localParticipant.identity ? "user" : "agent";
    let text = "";
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of reader) {
      text += chunk;
      onMessage({ id, role, text });
    }
  });

  try {
    await room.connect(url, token);
  } catch (e) {
    finish("error");
    return NOOP;
  }
  room.remoteParticipants.forEach(p => isAgent(p) && setAgentState(p.attributes["lk.agent.state"]));

  // The agent asks the page to go somewhere. Same-site relative paths only.
  room.localParticipant.registerRpcMethod("navigate", async data => {
    const { path } = JSON.parse(data.payload);
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
      throw new Error("bad path");
    }
    onNavigate(path);
    return "ok";
  });

  try {
    await room.localParticipant.setMicrophoneEnabled(true);
  } catch (e) {
    finish("mic-blocked");
    return NOOP;
  }
  const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
  if (micPub && micPub.track) meters.user = meter(audioCtx(), micPub.track.mediaStreamTrack);
  // Browsers only start audio after a gesture; this runs inside the click that began the session.
  room.startAudio().catch(() => {});
  tick();
  onState("connecting");

  return {
    end: () => finish("ended"),
    setMuted: muted => room.localParticipant.setMicrophoneEnabled(!muted),
    sendText: text => room.localParticipant.sendText(text, { topic: "lk.chat" }),
    startAudio: () => room.startAudio().catch(() => {})
  };
}
