import React from 'react'
import { ThemeProvider } from './src/context/ThemeContext'

// Gatsby SSR APIs require named exports.
// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => <ThemeProvider>{element}</ThemeProvider>
