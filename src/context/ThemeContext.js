import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const defaultState = {
  dark: false,
  notFound: false,
  toggleDark: () => {},
  setNotFound: () => {},
  setFound: () => {},
}

const ThemeContext = createContext(defaultState)

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const storedTheme = window.localStorage.getItem('dark')
    return storedTheme ? JSON.parse(storedTheme) : false
  })
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('dark', JSON.stringify(dark))
  }, [dark])

  const value = useMemo(
    () => ({
      dark,
      notFound,
      toggleDark: () => setDark(currentDark => !currentDark),
      setNotFound: () => setNotFound(true),
      setFound: () => setNotFound(false),
    }),
    [dark, notFound]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export default ThemeContext

export { ThemeProvider, useTheme }
