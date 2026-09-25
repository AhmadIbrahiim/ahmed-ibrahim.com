import React, { useState } from "react";

export function Avatar({ bubble = false }) {
  return (
    <span className="avatar" aria-hidden="true">
      <img src="/images/ahmed-pixel.png" width="96" height="96" alt="" />
      {bubble && (
        <span className="speech">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
    </span>
  );
}

export function PixelPose({ pose = "waving" }) {
  return (
    <span className={`pixel-pose pixel-pose--${pose}`} aria-hidden="true">
      <img
        src={`/images/ahmed-${pose}.png`}
        width="96"
        height="96"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export function VoiceSignal() {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      className={`voice-signal${playing ? " is-playing" : ""}`}
      type="button"
      aria-label={playing ? "Pause waveform animation" : "Animate waveform"}
      aria-pressed={playing}
      onClick={() => setPlaying(!playing)}
    >
      <span className="signal-bars" aria-hidden="true">
        {Array.from({ length: 57 }, (_, i) => (
          <i
            key={i}
            style={{
              "--height": `${4 +
                Math.abs(Math.sin(i * 1.7)) *
                  Math.sin((i / 56) * Math.PI) *
                  32}px`,
              "--delay": `${i * -0.07}s`
            }}
          />
        ))}
      </span>
      <span className="signal-control" aria-hidden="true">
        {playing ? "Ⅱ" : "▷"}
      </span>
      <span className="signal-caption">
        {playing
          ? "A little motion. No sound."
          : "A little signal. Give it a nudge."}
      </span>
    </button>
  );
}

const stages = [
  {
    name: "Listen",
    number: "01",
    text:
      "Real-time audio, with room for interruptions. Speech is a conversation, not a recording.",
    detail: "WebRTC · LiveKit · Speech recognition"
  },
  {
    name: "Understand",
    number: "02",
    text:
      "The right context, tools, and model for the next turn. Keeping the conversation on track.",
    detail: "LLM orchestration · Context · Tool calling"
  },
  {
    name: "Respond",
    number: "03",
    text:
      "Natural speech, delivered without an awkward wait. A useful answer is only half the work.",
    detail: "Text-to-speech · Turn-taking · Latency"
  }
];

export function VoicePipeline() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="voice-pipeline">
      <div
        className="pipeline-steps"
        role="group"
        aria-label="Explore the voice pipeline"
      >
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            type="button"
            aria-pressed={selected === index}
            aria-controls="pipeline-detail"
            onClick={() => setSelected(index)}
          >
            <span className="pipeline-dot" aria-hidden="true" />
            <span className="mono">{stage.number}</span>
            {stage.name}
          </button>
        ))}
      </div>
      <div
        className="pipeline-detail"
        id="pipeline-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <p>{stages[selected].text}</p>
        <span className="mono">{stages[selected].detail}</span>
      </div>
      <span className="pipeline-hint">
        Three parts. One conversation. Select a step.
      </span>
    </div>
  );
}
