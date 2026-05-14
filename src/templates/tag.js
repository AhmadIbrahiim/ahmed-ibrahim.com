import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layout'
import PostListing from '../components/PostListing'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'

export default function TagTemplate({ data, pageContext }) {
  const { tag } = pageContext
  const postEdges = data.allMarkdownRemark.edges

  return (
    <Layout>
      <div className="page-shell">
        <div className="label">Tag</div>
        <h1>{tag}.</h1>
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  )
}

export function Head({ pageContext }) {
  return <SEO title={`Posts tagged "${pageContext.tag}" – ${config.siteTitle}`} />
}

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
                gatsbyImageData(width: 50, height: 50, layout: FIXED, placeholder: BLURRED)
              }
            }
            date
            template
          }
        }
      }
    }
  }
`
