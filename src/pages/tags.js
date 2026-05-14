import React from 'react'
import { Link, graphql } from 'gatsby'
import kebabCase from 'lodash.kebabcase'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'

export default function TagsPage({ data }) {
  const { group } = data.allMarkdownRemark

  return (
    <Layout>
      <div className="page-shell">
        <div className="label">Index</div>
        <h1>Tags.</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {group.map(tag => (
            <Link
              to={`/tags/${kebabCase(tag.fieldValue)}/`}
              key={tag.fieldValue}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '1.5px solid #000',
                padding: '6px 10px',
                color: '#000',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {tag.fieldValue}{' '}
              <span style={{ color: '#666' }}>({tag.totalCount})</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export function Head() {
  return <SEO title={`Tags – ${config.siteTitle}`} />
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
`
