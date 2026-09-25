import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";

export default function CategoryTemplate({ data, pageContext }) {
  const { category } = pageContext;
  const postEdges = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <div className="page-shell">
        <Link className="back" to="/blog/">
          All writing
        </Link>
        <div className="label archive-label">Category</div>
        <h1>{category}.</h1>
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
}

export function Head({ pageContext, location }) {
  return (
    <SEO
      postPath={location.pathname}
      title={`${pageContext.category} – ${config.siteTitle}`}
    />
  );
}

export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { categories: { in: [$category] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
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
  }
`;
