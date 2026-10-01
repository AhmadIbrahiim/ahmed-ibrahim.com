import React from "react";

// The empty hero space the Aura sits in. AgentDock reads this element's rectangle to place the
// Aura, then moves it down to a corner dock as the page scrolls. The arrow and caption belong to
// the page, so they scroll away on their own.
export default function AgentSlot() {
  return (
    <div className="agent-slot" id="agent-slot">
      <svg className="agent-arrow" viewBox="0 0 360 360" aria-hidden="true">
        <path d="M296 306 C 326 270, 312 244, 268 232 M268 232 l10.2 9.6 M268 232 l13.6 -3" />
      </svg>
      <button
        type="button"
        className="agent-caption"
        onClick={() => window.dispatchEvent(new Event("agent:open"))}
      >
        Click to talk to me
      </button>
    </div>
  );
}
