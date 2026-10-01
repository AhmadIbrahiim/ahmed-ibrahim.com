import React from 'react'
import { ThemeProvider } from './src/context/ThemeContext'
import AgentDock from './src/components/AgentDock'

// Gatsby browser APIs require named exports.
// The dock lives at the root so a voice session survives page changes.
export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    {element}
    <AgentDock />
  </ThemeProvider>
)

// Lets the dock re-measure the hero slot after a route change.
export const onRouteUpdate = () => {
  window.dispatchEvent(new Event('agent:route'))
}
