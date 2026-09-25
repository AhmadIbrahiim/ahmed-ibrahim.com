import React from "react";
import { Link } from "gatsby";
import { Avatar, PixelPose } from "./Voice";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <span className="eyebrow">Your turn</span>
          <h2>
            Good things start
            <br />
            with a conversation<span className="accent">.</span>
          </h2>
        </div>
        <div className="footer-invitation">
          <PixelPose pose="contact" />
          <a className="text-link" href="mailto:me@ahmed-ibrahim.com">
            Say hello <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <Link to="/me/" className="footer-signature">
          <Avatar /> <span>© {new Date().getFullYear()} Ahmed Ibrahim</span>
        </Link>
        <div className="footer-links">
          <a href="https://github.com/AhmadIbrahiim">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/ahmedibrahhim/">LinkedIn ↗</a>
          <a href="/rss.xml">RSS ↗</a>
        </div>
      </div>
    </footer>
  );
}
