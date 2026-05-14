import React from 'react'
import { Link } from 'gatsby'
import { useTheme } from '../context/ThemeContext'

export default function Navigation({ menuLinks }) {
  const { dark, toggleDark } = useTheme()

  return (
    <nav className="topbar" aria-label="Main">
      <div className="brand">
        <Link to="/">Ahmed Ibrahim</Link>
      </div>
      {menuLinks.map(link => (
        <div key={link.name}>
          <Link to={link.link}>{link.name}</Link>
        </div>
      ))}
      <div>
        <button
          type="button"
          className="dark-toggle"
          onClick={toggleDark}
          aria-label="Toggle dark mode"
        >
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  )
}
