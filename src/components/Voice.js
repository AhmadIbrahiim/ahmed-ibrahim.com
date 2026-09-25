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

const poseDetails = {
  listening: { label: "Animate Ahmed listening", note: "All ears." },
  building: { label: "Animate Ahmed at his laptop", note: "One more idea." },
  writing: { label: "Animate Ahmed writing", note: "Noted." },
  waving: { label: "Say hello to pixel Ahmed", note: "Hey there!" },
  contact: { label: "Animate Ahmed with an envelope", note: "Say hello!" }
};

export function PixelPose({ pose = "waving" }) {
  const [replay, setReplay] = useState(0);
  return (
    <button
      type="button"
      className={`pixel-pose pixel-pose--${pose}`}
      aria-label={poseDetails[pose].label}
      onClick={() => setReplay(current => current + 1)}
    >
      <span
        key={replay}
        className={replay ? "pose-replay" : "pose-rest"}
        aria-hidden="true"
      >
        <span className="pose-sprite">
          <img
            src={`/images/ahmed-${pose}-sprite.png`}
            width="192"
            height="192"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="pose-note">{poseDetails[pose].note}</span>
      </span>
    </button>
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
