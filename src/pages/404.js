import React, { useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import { useTheme } from '../context/ThemeContext'

export default function NotFoundPage() {
  const { setFound, setNotFound } = useTheme()

  useEffect(() => {
    setNotFound()
    return () => {
      setFound()
    }
  }, [setFound, setNotFound])

  return (
    <Layout>
      <div className="page-shell">
        <div className="label">Error</div>
        <h1>404.</h1>
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#1a1a1a',
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 540,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist — it may have been moved,
          renamed, or never existed in the first place.
        </p>
        <Link to="/" className="btn" style={{ marginTop: 18 }}>
          ← Back home
        </Link>
      </div>
    </Layout>
  )
}

export function Head() {
  return <SEO title={`404 – ${config.siteTitle}`} />
}
