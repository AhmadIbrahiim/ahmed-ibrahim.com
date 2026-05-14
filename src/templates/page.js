import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'

export default function PageTemplate({ data }) {
  const postNode = data.markdownRemark
  const page = postNode.frontmatter

  return (
    <Layout>
      <article className="post-shell">
        <h1>{page.title}</h1>
        <div className="post" dangerouslySetInnerHTML={{ __html: postNode.html }} />
      </article>
    </Layout>
  )
}

export function Head({ data, pageContext }) {
  const { title } = data.markdownRemark.frontmatter

  return (
    <SEO
      title={`${title} – ${config.siteTitle}`}
      postNode={data.markdownRemark}
      postPath={pageContext.slug}
      postSEO
    />
  )
}

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        template
      }
      fields {
        slug
        date
      }
    }
  }
`
