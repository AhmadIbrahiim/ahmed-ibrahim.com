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
