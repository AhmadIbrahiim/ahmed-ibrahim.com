import React from "react";
import { Link } from "gatsby";
import { useTheme } from "../context/ThemeContext";

export default function Navigation({ menuLinks }) {
  const { dark, toggleDark } = useTheme();
  return (
    <nav className="topbar" aria-label="Main">
      <Link className="brand" to="/">
        Ahmed Ibrahim
        <span className="brand-pixel" aria-hidden="true" />
      </Link>
      <div className="nav-links">
        {menuLinks.map(link => (
          <Link key={link.name} to={link.link} activeClassName="active">
            {link.name}
          </Link>
        ))}
        <button
          type="button"
          className="dark-toggle"
          onClick={toggleDark}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={dark}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
