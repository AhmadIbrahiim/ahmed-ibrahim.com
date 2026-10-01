import React from "react";

// The empty hero space the Aura sits in. AgentDock reads this element's rectangle to place the
// Aura (and its arrow and caption), then moves them all down to a corner dock as the page scrolls.
export default function AgentSlot() {
  return <div className="agent-slot" id="agent-slot" aria-hidden="true" />;
}
