import React, { useCallback, useEffect, useRef, useState } from "react";
import { navigate } from "gatsby";
import { useTheme } from "../../context/ThemeContext";
import Aura from "./Aura";

// Where the Aura travels. On the home page it starts in #agent-slot and glides to the corner
// dock over the first TRAVEL pixels of scroll; everywhere else it is just the dock. On phones,
// talking opens a full-screen "voice mode": the Aura centres above a bottom sheet.
const TRAVEL = 420;
const HERO_MAX = 224;
const DOCK_BOX = 56;
const DOCK_INSET = 52; // distance from the viewport edge to the dock's centre
const PHONE = 600;

const CHIPS = [
  "Show me his voice AI work",
  "What has he written?",
  "How do I reach him?"
];

const STATUS = {
  connecting: "Connecting",
  idle: "Ready when you are",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking"
};

const ENDINGS = {
  ended: "That was fun. Tap the Aura to talk again.",
  error: "I couldn't connect just now. Please try again in a moment.",
  "mic-blocked":
    "I need your microphone to hear you. Allow it in your browser, then try again."
};

function MicIcon({ off }) {
  return (
    <svg className="agent-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function Conversation({ variant, view, onClose }) {
  const {
    phase,
    agentState,
    slow,
    muted,
    messages,
    audioBlocked,
    onChip,
    onMute,
    onEnd,
    onAgain,
    onSound
  } = view;
  const live = phase === "live";
  const logEl = useRef(null);
  useEffect(() => {
    const el = logEl.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  let status = "";
  if (live) {
    if (muted) status = "Muted";
    else if (slow && agentState === "connecting") status = "Waking up, about 15 seconds";
    else status = STATUS[agentState] || "";
  }
  const shown = variant === "hero" ? messages.slice(-2) : messages;
  const showChips = live && messages.length <= 2 && agentState !== "connecting";

  return (
    <>
      <header className="agent-head">
        <span className={`agent-dot agent-dot--${muted ? "muted" : agentState}${live ? "" : " is-off"}`} />
        <div className="agent-head__text">
          {variant === "card" && <strong>Ahmed&rsquo;s AI assistant</strong>}
          <p className="agent-status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
        {variant === "card" && (
          <button type="button" className="agent-x" onClick={onClose} aria-label="Close conversation">
            <svg className="agent-ico" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </header>
      {!live && ENDINGS[phase] && <p className="agent-ending">{ENDINGS[phase]}</p>}
      {shown.length > 0 && (
        <ol className="agent-log" aria-label="Conversation captions" ref={logEl}>
          {shown.map(m => (
            <li key={m.id} className={`agent-msg agent-msg--${m.role}`}>
              {m.text}
            </li>
          ))}
        </ol>
      )}
      {showChips && (
        <div className="agent-chips">
          {CHIPS.map(c => (
            <button type="button" key={c} onClick={() => onChip(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="agent-bar">
        {live ? (
          <>
            <button
              type="button"
              className="agent-round"
              aria-pressed={muted}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              onClick={onMute}
            >
              <MicIcon off={muted} />
            </button>
            {audioBlocked && (
              <button type="button" className="agent-pill" onClick={onSound}>
                Enable sound
              </button>
            )}
            <button type="button" className="agent-pill agent-pill--end" onClick={onEnd}>
              End
            </button>
          </>
        ) : (
          <button type="button" className="agent-pill agent-pill--go" onClick={onAgain}>
            Talk to me
          </button>
        )}
      </div>
      {variant === "card" && (
        <p className="agent-note">
          Your voice is processed by AI providers to power this chat. Calls end after
          3 minutes.
        </p>
      )}
    </>
  );
}

export default function AgentDock() {
  const { dark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState("off"); // off | live | ended | error | mic-blocked
  const [agentState, setAgentState] = useState("connecting");
  const [muted, setMuted] = useState(false);
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("dock"); // hero | dock
  const [phone, setPhone] = useState(false);

  const levelRef = useRef(0);
  const session = useRef(null);
  const dockEl = useRef(null);
  const heroEl = useRef(null);
  const pose = useRef({ cx: 0, cy: 0, box: DOCK_BOX });
  const voiceMode = phone && open && phase !== "off"; // phones: full-screen voice mode
  const voiceRef = useRef(false);
  voiceRef.current = voiceMode;

  useEffect(() => setMounted(true), []);

  // A class on <html> lets the page's own arrow and caption step aside once talking starts.
  useEffect(() => {
    document.documentElement.classList.toggle("agent-active", phase !== "off");
  }, [phase]);

  // --- placement: hero slot -> corner dock, driven by scroll -------------------------------
  const applyHeroPanel = useCallback(() => {
    const el = heroEl.current;
    if (!el) return;
    const { cx, cy, box } = pose.current;
    el.style.left = `${cx}px`;
    el.style.top = `${cy + box * 0.6 + 6}px`;
  }, []);

  const place = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const slot = document.getElementById("agent-slot");
    const t = slot ? Math.min(1, window.scrollY / TRAVEL) : 1;
    const e = t * t * (3 - 2 * t);
    const dockX = vw - DOCK_INSET;
    const dockY = vh - DOCK_INSET;
    let next = { cx: dockX, cy: dockY, box: DOCK_BOX };
    if (voiceRef.current) {
      const box = Math.min(190, vw * 0.5);
      next = { cx: vw / 2, cy: Math.max(box * 0.8, vh * 0.24), box };
    } else if (slot) {
      const r = slot.getBoundingClientRect();
      const box = Math.min(HERO_MAX, r.width * 0.62, r.height * 0.7);
      const hx = r.left + r.width / 2;
      const hy = r.top + r.height * 0.44;
      next = {
        cx: hx + (dockX - hx) * e,
        cy: hy + (dockY - hy) * e,
        box: box + (DOCK_BOX - box) * e
      };
    }
    pose.current = next;
    const el = dockEl.current;
    if (el) {
      el.style.width = `${next.box}px`;
      el.style.height = `${next.box}px`;
      el.style.transform = `translate3d(${next.cx - next.box / 2}px, ${next.cy - next.box / 2}px, 0)`;
    }
    applyHeroPanel();
    setPhone(vw <= PHONE);
    const m = slot && e < 0.5 && vw > PHONE ? "hero" : "dock";
    setMode(prev => (prev === m ? prev : m));
  }, [applyHeroPanel]);

  useEffect(() => {
    if (!mounted) return undefined;
    let frame = 0;
    const queue = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          place();
        });
      }
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("agent:route", queue);
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    place();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("agent:route", queue);
      ro.disconnect();
    };
  }, [mounted, place]);

  // Entering or leaving phone voice mode glides the Aura instead of jumping.
  useEffect(() => {
    const el = dockEl.current;
    if (!el) return undefined;
    el.classList.add("is-gliding");
    place();
    const id = window.setTimeout(() => el.classList.remove("is-gliding"), 520);
    return () => window.clearTimeout(id);
  }, [voiceMode, place]);

  useEffect(() => {
    if (!voiceMode) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [voiceMode]);

  // The hero panel mounts after a mode change; give it its position straight away.
  useEffect(applyHeroPanel, [mode, open, phase, applyHeroPanel]);

  // --- session ------------------------------------------------------------------------------
  const finish = useCallback(why => {
    session.current = null;
    levelRef.current = 0;
    setPhase(why);
    setOpen(true);
    setSlow(false);
    setAudioBlocked(false);
  }, []);

  const start = useCallback(async () => {
    // Created inside the click so Safari treats audio as user-initiated.
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const audioContext = Ctx ? new Ctx() : undefined;
    if (audioContext) audioContext.resume().catch(() => {});
    setMessages([]);
    setMuted(false);
    setSlow(false);
    setAgentState("connecting");
    setPhase("live");
    setOpen(true);
    try {
      const { default: startSession } = await import("./voiceSession");
      session.current = await startSession({
        audioContext,
        onLevel: v => {
          levelRef.current = v;
        },
        onState: setAgentState,
        onSlow: () => setSlow(true),
        onAudioBlocked: setAudioBlocked,
        onNavigate: path => navigate(path),
        onEnd: finish,
        onMessage: m =>
          setMessages(list => {
            const i = list.findIndex(x => x.id === m.id);
            if (i < 0) return [...list, m];
            const copy = list.slice();
            copy[i] = m;
            return copy;
          })
      });
    } catch {
      finish("error");
    }
  }, [finish]);

  const activate = useCallback(() => {
    if (phase === "live") setOpen(o => !o);
    else start();
  }, [phase, start]);

  // Latest handler for the hero caption ("Click to talk to me").
  const activateRef = useRef(activate);
  activateRef.current = activate;
  useEffect(() => {
    const onOpen = () => activateRef.current();
    window.addEventListener("agent:open", onOpen);
    return () => window.removeEventListener("agent:open", onOpen);
  }, []);

  useEffect(() => {
    const onKey = e => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (session.current) session.current.end();
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (session.current) session.current.setMuted(next);
  };
  const sendChip = text => {
    if (!session.current) return;
    setMessages(list => [...list, { id: `local-${Date.now()}`, role: "user", text }]);
    session.current.sendText(text);
  };

  if (!mounted) return null; // client only: nothing here is server-rendered

  let auraState = "idle";
  if (phase === "live") auraState = muted ? "muted" : agentState;
  else if (phase === "error" || phase === "mic-blocked") auraState = "error";

  const shared = {
    phase,
    agentState,
    slow,
    muted,
    messages,
    audioBlocked,
    onChip: sendChip,
    onMute: toggleMute,
    onEnd: () => session.current && session.current.end(),
    onAgain: start,
    onSound: () => session.current && session.current.startAudio()
  };
  const label =
    phase === "live" ? "Open or close the conversation" : "Talk to Ahmed’s AI assistant";
  const showPanel = open && phase !== "off";

  return (
    <div className={`agent-root${dark ? " dark" : ""}`}>
      {voiceMode && <div className="agent-scrim" />}
      <div className="agent-dock" ref={dockEl}>
        <Aura state={auraState} levelRef={levelRef} dark={dark} />
        <button
          type="button"
          className="agent-dock__btn"
          onClick={activate}
          aria-label={label}
          title={label}
          aria-expanded={phase === "live" ? open : undefined}
        />
      </div>
      {showPanel && mode === "hero" && (
        <div className="agent-hero-panel" ref={heroEl}>
          <Conversation variant="hero" view={shared} />
        </div>
      )}
      {showPanel && mode === "dock" && (
        <aside className="agent-card" aria-label="Conversation with Ahmed’s AI assistant">
          <Conversation variant="card" view={shared} onClose={() => setOpen(false)} />
        </aside>
      )}
    </div>
  );
}
