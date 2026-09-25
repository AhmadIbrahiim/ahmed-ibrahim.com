import React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import SEO from "../components/SEO";
import { Avatar } from "../components/Voice";
import config from "../../data/SiteConfig";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="page-shell lost-signal">
        <Avatar bubble />
        <span className="eyebrow">404 / Lost the signal</span>
        <h1>
          Nothing on
          <br />
          this frequency.
        </h1>
        <p>This page may have moved, or the link took a wrong turn.</p>
        <Link to="/" className="text-link">
          Let’s head home ↗
        </Link>
      </div>
    </Layout>
  );
}
export function Head({ location }) {
  return (
    <SEO
      postPath={location.pathname}
      title={`Page not found – ${config.siteTitle}`}
    />
  );
}
