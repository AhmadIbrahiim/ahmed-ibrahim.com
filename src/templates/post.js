import React from 'react'
import { graphql, Link } from 'gatsby'
import kebabCase from 'lodash.kebabcase'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import { editOnGithub, formatDate } from '../utils/global'
import ahmed from '../../content/images/profile-small.jpg'

export default function PostTemplate({ data }) {
  const postNode = data.markdownRemark
  const post = postNode.frontmatter
  const date = formatDate(post.date)
  const githubLink = editOnGithub(post)
  const twitterShare = `https://twitter.com/share?text=${encodeURIComponent(post.title)}&url=${
    config.siteUrl
  }/${post.slug}/&via=Ahmed_ibrahhim`
  const category = post.categories && post.categories[0]

  return (
    <Layout>
      <article className="post-shell">
        <Link className="back" to="/blog">
          All writing
        </Link>

        <header className="post-header">
          <div className="byline">
            <div className="byline-photo">
              <img src={ahmed} alt="Ahmed Ibrahim" />
            </div>
            <div className="byline-text">
              <span className="byline-label">Written by</span>
              <span className="byline-name">Ahmed Ibrahim</span>
              <span className="byline-role">
                Senior Software Engineer · Voice AI &amp; LLM
              </span>
            </div>
            <div className="byline-social">
              <a
                href="https://twitter.com/ahmed_ibrahhim"
                target="_blank"
                rel="noopener noreferrer"
              >
                @ahmed_ibrahhim
              </a>
              <a
                href="https://github.com/AhmadIbrahiim"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="post-kicker">
            Article
            {category && (
              <>
                {' · '}
                <span className="post-kicker-cat">{category}</span>
              </>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="post-meta-primary">{date}</span>
            {postNode.timeToRead && (
              <>
                <span className="sep">·</span>
                <span className="post-meta-primary">{postNode.timeToRead} min read</span>
              </>
            )}
            <span className="sep">·</span>
            <a href={twitterShare} target="_blank" rel="noopener noreferrer">
              Share
            </a>
            <span className="sep">·</span>
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              Edit on GitHub
            </a>
          </div>
        </header>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: postNode.html }} />

        <footer className="post-footer">
          <div className="post-tags-row">
            {post.tags &&
              post.tags.map(tag => (
                <Link key={tag} className="post-tag" to={`/tags/${kebabCase(tag)}/`}>
                  {tag}
                </Link>
              ))}
          </div>
          <Link className="more-cta" to="/blog">
            More writing
          </Link>
        </footer>
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
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 150, height: 150, layout: FIXED, placeholder: BLURRED)
          }
        }
        slug
        date
        categories
        tags
        template
        seoImage {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, placeholder: NONE, quality: 100)
          }
        }
      }
      fields {
        slug
        date
      }
    }
  }
`
