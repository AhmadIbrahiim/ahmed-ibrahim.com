import React from "react";
import { Link, graphql } from "gatsby";
import kebabCase from "lodash.kebabcase";
import Layout from "../layout";
import SEO from "../components/SEO";
import { PixelPose } from "../components/Voice";
import config from "../../data/SiteConfig";

export default function CategoriesPage({ data }) {
  const { group } = data.allMarkdownRemark;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-heading">
          <div>
            <div className="label">Index</div>
            <h1>Categories.</h1>
          </div>
          <PixelPose pose="writing" />
        </div>
        <div className="topic-links topic-index">
          {group.map(category => (
            <Link
              to={`/categories/${kebabCase(category.fieldValue)}/`}
              key={category.fieldValue}
            >
              {category.fieldValue} <span>({category.totalCount})</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function Head() {
  return (
    <SEO postPath="/categories/" title={`Categories – ${config.siteTitle}`} />
  );
}

export const pageQuery = graphql`
  query CategoriesQuery {
    allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { categories: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
