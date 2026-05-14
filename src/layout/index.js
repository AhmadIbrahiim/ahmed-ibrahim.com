import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import config from '../../data/SiteConfig'
import { useTheme } from '../context/ThemeContext'
import '../styles/main.scss'

export default function MainLayout({ children, hideChrome = false }) {
  const { dark, notFound } = useTheme()
  let themeClass = ''

  if (notFound) {
    themeClass = 'not-found'
  } else if (dark) {
    themeClass = 'dark'
  }

  return (
    <div className={`theme${themeClass ? ` ${themeClass}` : ''}`}>
      <div className="shell">
        {!hideChrome && <Navigation menuLinks={config.menuLinks} />}
        <main id="main-content">{children}</main>
        {!hideChrome && <Footer />}
      </div>
    </div>
  )
}
