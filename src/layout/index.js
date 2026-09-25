import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import config from "../../data/SiteConfig";
import { useTheme } from "../context/ThemeContext";
import "../styles/main.scss";

export default function MainLayout({ children, hideChrome = false }) {
  const { dark } = useTheme();
  return (
    <div className={`theme${dark ? " dark" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="shell">
        {!hideChrome && <Navigation menuLinks={config.menuLinks} />}
        <main id="main-content" tabIndex="-1">
          {children}
        </main>
        {!hideChrome && <Footer />}
      </div>
    </div>
  );
}
