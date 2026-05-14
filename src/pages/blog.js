import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import kebabCase from 'lodash.kebabcase'

import Layout from '../layout'
import PostListing from '../components/PostListing'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'

export default function BlogPage({ data }) {
  const [searchTerm, setSearchTerm] = useState('')
  const posts = data.posts.edges
  const categories = data.categories.group
  const filteredPosts = posts.filter(({ node }) =>
    node.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="page-shell">
        <div className="label">All writing</div>
        <h1>Writing.</h1>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          {categories.map(category => (
            <Link
              to={`/categories/${kebabCase(category.fieldValue)}/`}
              key={category.fieldValue}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10.5,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '1.5px solid #000',
                padding: '5px 9px',
                color: '#000',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {category.fieldValue}{' '}
              <span style={{ color: '#666' }}>({category.totalCount})</span>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 18 }}>
          <input
            type="text"
            name="searchTerm"
            value={searchTerm}
            placeholder="Filter posts…"
            onChange={event => setSearchTerm(event.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              border: '1.5px solid #000',
              background: '#fff',
              color: '#000',
              outline: 'none',
            }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {filteredPosts.length} posts
          </span>
        </div>
        <PostListing postEdges={filteredPosts} />
      </div>
    </Layout>
  )
}

export function Head() {
  return <SEO title={`Writing – ${config.siteTitle}`} />
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
                gatsbyImageData(width: 50, height: 50, layout: FIXED, placeholder: BLURRED)
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
`
