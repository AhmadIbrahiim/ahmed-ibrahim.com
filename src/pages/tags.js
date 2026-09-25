import React from "react";
import { Link, graphql } from "gatsby";
import kebabCase from "lodash.kebabcase";
import Layout from "../layout";
import SEO from "../components/SEO";
import { PixelPose } from "../components/Voice";
import config from "../../data/SiteConfig";

export default function TagsPage({ data }) {
  const { group } = data.allMarkdownRemark;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-heading">
          <div>
            <div className="label">Index</div>
            <h1>Tags.</h1>
          </div>
          <PixelPose pose="writing" />
        </div>
        <div className="topic-links topic-index">
          {group.map(tag => (
            <Link
              to={`/tags/${kebabCase(tag.fieldValue)}/`}
              key={tag.fieldValue}
            >
              {tag.fieldValue} <span>({tag.totalCount})</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function Head() {
  return <SEO postPath="/tags/" title={`Tags – ${config.siteTitle}`} />;
}

export const pageQuery = graphql`
  query TagsQuery {
    allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
