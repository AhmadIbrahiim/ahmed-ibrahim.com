import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-prompt">echo &quot;say hi&quot;</div>
        <h2 className="footer-name">
          LET&apos;S
          <br />
          TALK<span className="punkt">.</span>
        </h2>
        <a className="footer-cta" href="mailto:me@ahmed-ibrahim.com">
          me@ahmed-ibrahim.com
        </a>
      </div>
      <div className="footer-bottom">
        <div>
          <span className="h">Around</span>
          <div className="row">
            <a
              href="https://github.com/AhmadIbrahiim"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/ahmed_ibrahhim"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a href="https://www.linkedin.com/in/ahmedibrahhim" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a
              href="https://www.ahmed-ibrahim.com/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
            >
              RSS
            </a>
          </div>
        </div>
        <div>
          <span className="h">Built with</span>
          <span className="muted">Gatsby · React · Sass</span>
          <span className="muted">0 cookies · 0 trackers</span>
        </div>
        <div>
          <span className="h">Colophon</span>
          <span className="muted">© 2026 Ahmed Ibrahim</span>
          <span className="muted">Seattle, WA</span>
        </div>
      </div>
    </footer>
  )
}
