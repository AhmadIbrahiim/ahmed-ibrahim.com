import React from 'react'
import { ThemeProvider } from './src/context/ThemeContext'
import AgentDock from './src/components/AgentDock'

// Gatsby SSR APIs require named exports. AgentDock renders nothing on the server.
// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    {element}
    <AgentDock />
  </ThemeProvider>
)
