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
  "What does Ahmed build?",
  "Show me his open-source work",
  "How does he approach voice agents?",
  "How do I reach him?"
];

const STATUS = {
  connecting: "Connecting",
  reconnecting: "Reconnecting",
  idle: "Ready when you are",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking"
};

// Failures where the visitor should also get a way to reach Ahmed without the assistant.
const FAILURES = ["error", "busy", "timeout", "unavailable", "dropped"];

const ENDINGS = {
  ended: "That was fun. Tap the Aura to talk again.",
  error: "I couldn't connect just now. Please try again in a moment.",
  busy: "That's a lot of conversations from one place. Please try again in a few minutes.",
  offline: "You seem to be offline. Check your connection, then try again.",
  dropped: "The connection dropped. Tap Talk to me to start again.",
  timeout: "The assistant didn't answer this time. Please try again in a moment.",
  unavailable: "The assistant isn't available right now.",
  "no-mic": "I couldn't find a microphone. Plug one in or check your settings, then try again.",
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
  const typing = live && agentState === "thinking";
  const logEl = useRef(null);
  useEffect(() => {
    const el = logEl.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

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
      {!live && ENDINGS[phase] && (
        <p className="agent-ending" role={phase === "ended" ? undefined : "alert"}>
          {ENDINGS[phase]}
        </p>
      )}
      {!live && FAILURES.includes(phase) && (
        <p className="agent-ending">
          Or email Ahmed directly:{" "}
          <a href="mailto:me@ahmed-ibrahim.com">me@ahmed-ibrahim.com</a>
        </p>
      )}
      {(shown.length > 0 || typing) && (
        <ol className="agent-log" aria-label="Conversation captions" ref={logEl}>
          {shown.map(m => (
            <li key={m.id} className={`agent-msg agent-msg--${m.role}`}>
              {m.text}
            </li>
          ))}
          {typing && (
            <li className="agent-msg agent-msg--agent agent-typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </li>
          )}
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
  const [hintOff, setHintOff] = useState(false); // visitor dismissed the docked hint

  const levelRef = useRef(0);
  const session = useRef(null);
  const dockEl = useRef(null);
  const heroEl = useRef(null);
  const hintEl = useRef(null);
  const dockHintEl = useRef(null);
  const pose = useRef({ cx: 0, cy: 0, box: DOCK_BOX });
  const voiceMode = phone && open && phase !== "off"; // phones: full-screen voice mode
  const voiceRef = useRef(false);
  voiceRef.current = voiceMode;

  useEffect(() => {
    setMounted(true);
    try {
      setHintOff(window.localStorage.getItem("agentHintOff") === "1");
    } catch {
      // Storage can be blocked; the hint then simply shows again next visit.
    }
  }, []);
  const dismissHint = () => {
    setHintOff(true);
    try {
      window.localStorage.setItem("agentHintOff", "1");
    } catch {
      // Not persisted; that is fine.
    }
  };

  // --- placement: hero slot -> corner dock, driven by scroll -------------------------------
  const applyHeroPanel = useCallback(() => {
    const el = heroEl.current;
    if (!el) return;
    const { cx, cy, box } = pose.current;
    el.style.left = `${cx}px`;
    el.style.top = `${cy + box * 0.8 + 8}px`;
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
      // Smaller on narrow screens so the hint bubble fits inside the slot.
      const box = Math.min(vw <= 900 ? 170 : HERO_MAX, r.width * 0.62, r.height * 0.7);
      const hx = r.left + r.width / 2;
      const hy = r.top + r.height * 0.44;
      next = {
        cx: hx + (dockX - hx) * e,
        cy: hy + (dockY - hy) * e,
        box: box + (DOCK_BOX - box) * e
      };
    }
    pose.current = next;
    const hint = hintEl.current;
    if (hint) {
      // The arrow and caption ride along with the Aura and are gone by the time it docks.
      const o = Math.max(0, Math.min(1, 1 - e * 2.5));
      hint.style.setProperty("--k", String(next.box / HERO_MAX));
      hint.style.opacity = String(o);
      hint.style.visibility = o < 0.02 ? "hidden" : "visible";
    }
    const dockHint = dockHintEl.current;
    if (dockHint) {
      // Once docked, the hint comes back in its own spot: bubble beside the Aura, arrow pointing at it.
      const o = Math.max(0, Math.min(1, (e - 0.6) * 2.5));
      dockHint.style.opacity = String(o);
      dockHint.style.visibility = o < 0.02 ? "hidden" : "visible";
    }
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
    } catch (e) {
      let why = "error";
      if (e && e.status === 429) why = "busy";
      else if ((e && e.network) || !window.navigator.onLine) why = "offline";
      finish(why);
    }
  }, [finish]);

  const activate = useCallback(() => {
    if (phase === "live") setOpen(o => !o);
    else start();
  }, [phase, start]);

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
  if (phase === "live") {
    auraState = muted ? "muted" : agentState;
    if (agentState === "reconnecting") auraState = "connecting";
  }
  else if (phase !== "off" && phase !== "ended") auraState = "error";

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
        {phase === "off" && (
          <div className="agent-hint" ref={hintEl}>
            <svg className="agent-arrow" viewBox="0 0 360 360" aria-hidden="true">
              <path d="M296 290 C 326 266, 312 244, 268 232 M268 232 l10.2 9.6 M268 232 l13.6 -3" />
            </svg>
            <button type="button" className="agent-caption" onClick={activate}>
              <strong>Ask me about Ahmed&rsquo;s voice AI work</strong>
              <small>Click to talk to me</small>
            </button>
          </div>
        )}
        {phase === "off" && !hintOff && (
          <div className="agent-hint-dock" ref={dockHintEl}>
            <svg className="agent-hint-dock__arrow" viewBox="0 0 72 72" aria-hidden="true">
              <path d="M6 18 C 26 8, 50 18, 63 40 M63 40 l-0.5 -11 M63 40 l-9.4 -5.8" />
            </svg>
            <div className="agent-hint-dock__card">
              <button type="button" className="agent-caption" onClick={activate}>
                <strong>Ask me about Ahmed&rsquo;s voice AI work</strong>
                <small>Click to talk to me</small>
              </button>
              <button
                type="button"
                className="agent-hint-dock__x"
                onClick={dismissHint}
                aria-label="Dismiss this hint"
              >
                <svg className="agent-ico" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        )}
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
