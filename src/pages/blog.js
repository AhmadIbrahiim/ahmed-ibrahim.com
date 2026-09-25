import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import kebabCase from "lodash.kebabcase";

import Layout from "../layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import { PixelPose } from "../components/Voice";
import config from "../../data/SiteConfig";

export default function BlogPage({ data }) {
  const [searchTerm, setSearchTerm] = useState("");
  const posts = data.posts.edges;
  const categories = data.categories.group;
  const filteredPosts = posts.filter(({ node }) =>
    node.frontmatter.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-heading">
          <div>
            <div className="label">All writing</div>
            <h1>Writing.</h1>
          </div>
          <PixelPose pose="writing" />
        </div>
        <p className="page-lede">
          Notes from production. Voice AI, TypeScript, and the things I learn by
          building.
        </p>
        <div className="topic-links">
          {categories.map(category => (
            <Link
              to={`/categories/${kebabCase(category.fieldValue)}/`}
              key={category.fieldValue}
            >
              {category.fieldValue} <span>({category.totalCount})</span>
            </Link>
          ))}
        </div>
        <div className="search-row">
          <label htmlFor="writing-search">Find something to read</label>
          <input
            id="writing-search"
            type="search"
            name="searchTerm"
            value={searchTerm}
            placeholder="Search article titles…"
            onChange={event => setSearchTerm(event.target.value)}
          />
          <span className="small-note" role="status">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>
        {filteredPosts.length === 0 && (
          <p className="empty-state">
            No titles match “{searchTerm}”. Try a different word, or{" "}
            <button
              type="button"
              className="inline-button"
              onClick={() => setSearchTerm("")}
            >
              clear the search
            </button>
            .
          </p>
        )}
        <PostListing postEdges={filteredPosts} />
      </div>
    </Layout>
  );
}

export function Head() {
  return <SEO postPath="/blog/" title={`Writing – ${config.siteTitle}`} />;
}

export const pageQuery = graphql`
  query BlogQuery {
    posts: allMarkdownRemark(
      limit: 2000
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 180)
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  width: 50
                  height: 50
                  layout: FIXED
                  placeholder: BLURRED
                )
              }
            }
            date
            template
          }
        }
      }
    }
    categories: allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { categories: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
