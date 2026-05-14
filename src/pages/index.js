import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import projects from '../../data/projects'
import ahmed from '../../content/images/profile.jpg'

const PROJECT_META = {
  '3lagnb.com': '500K users',
  'Imageiry.com': 'OG API',
  'Blood Bot': 'MENA top-20',
  'Mogrib.com': 'Arabic Q&A',
}

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function initialsFor(title) {
  return title
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function IndexPage({ data }) {
  const edges = data.latest.edges
  const featured = edges[0]?.node
  const rest = edges.slice(1, 5).map(e => e.node)

  return (
    <Layout>
      <header className="hero">
        <div className="photo">
          <img src={ahmed} alt="Ahmed Ibrahim" />
        </div>
        <div className="text">
          <div className="kicker">
            Senior Software Engineer · Voice AI &amp; LLM · Seattle
          </div>
          <h1 className="giant">
            AHMED
            <br />
            IBRAHIM<span className="punkt">.</span>
          </h1>
          <p className="role">
            I build <strong>human-quality Voice AI</strong> systems for real
            business phone calls. Currently building Goodcall&apos;s
            4th-generation LLM voice agent with the team — real-time speech
            pipelines, model orchestration, and production infrastructure on GCP.
          </p>
          <div className="hero-stack">
            <span className="l">Stack</span>
            <span>Node.js</span> · <span>TypeScript</span> · <span>Python</span>{' '}
            · <span>WebRTC</span> · <span>LiveKit</span> · <span>GPT-4</span> ·{' '}
            <span>Gemini</span> · <span>GCP</span> · <span>PostgreSQL</span>
          </div>
        </div>
      </header>

      <section className="grid">
        <div className="cell full" id="now">
          <div className="cell-head">
            <div className="cell-label">Now</div>
            <span className="status-pill">
              <span className="dot" aria-hidden="true" />
              Available
            </span>
          </div>
          <div className="now-content">
            <h3>Building Goodcall&apos;s 4th-gen voice agent.</h3>
            <p>
              An LLM-first rebuild. Real-time voice on LiveKit/WebRTC, ASR → LLM
              → TTS pipeline, GPT-4 and Gemini with routing and fallback.
              Thousands of calls per day across hundreds of US businesses. 10+
              years shipping software, the last 5 in voice AI.
            </p>
            <a className="open" href="mailto:me@ahmed-ibrahim.com">
              Open to senior IC roles
            </a>
          </div>
        </div>
      </section>

      {featured && (
        <article className="article-row">
          <div className="ar-grid">
            <div className="ar-meta">
              {(() => {
                const ftThumb = getImage(featured.frontmatter.thumbnail)
                return ftThumb ? (
                  <GatsbyImage
                    image={ftThumb}
                    alt=""
                    imgClassName="ar-thumb"
                    style={{
                      width: 56,
                      height: 56,
                      border: '1.5px solid #000',
                      marginBottom: 18,
                    }}
                  />
                ) : (
                  <span className="ar-thumb-fallback" aria-hidden="true">
                    {initialsFor(featured.frontmatter.title)}
                  </span>
                )
              })()}
              <div className="lab">Latest essay</div>
              <h2>{featured.frontmatter.title}</h2>
              <div className="info">
                <span className="info-item">
                  <span className="v">{fmtDate(featured.fields.date)}</span>
                </span>
                {featured.timeToRead && (
                  <span className="info-item">
                    <span className="v">{featured.timeToRead} min</span>
                  </span>
                )}
                {featured.frontmatter.categories && featured.frontmatter.categories[0] && (
                  <span className="info-item">
                    <span className="v">
                      {featured.frontmatter.categories[0]}
                    </span>
                  </span>
                )}
              </div>
              <Link className="read" to={featured.fields.slug}>
                Read full
              </Link>
            </div>
            <div className="ar-body">
              <p>{featured.excerpt}</p>
            </div>
          </div>
        </article>
      )}

      <section className="grid">
        <div className="cell full" id="writing">
          <div className="cell-head">
            <div className="cell-label">More writing</div>
            <Link className="view-all" to="/blog">
              View all →
            </Link>
          </div>
          <p className="cell-lede">
            Notes from production — <em>voice AI</em>, TypeScript, databases,
            and the occasional Node deep-dive.
          </p>
          <div className="writing-grid">
            {rest.map((node, idx) => {
              const thumb = getImage(node.frontmatter.thumbnail)
              const title = node.frontmatter.title
              const category =
                node.frontmatter.categories && node.frontmatter.categories[0]
              const num = String(idx + 1).padStart(2, '0')
              return (
                <Link
                  className="wpost"
                  to={node.fields.slug}
                  key={node.fields.slug}
                >
                  <span className="n" aria-hidden="true">
                    {num}
                  </span>
                  {thumb ? (
                    <GatsbyImage image={thumb} alt="" />
                  ) : (
                    <span className="thumb-fallback" aria-hidden="true">
                      {initialsFor(title)}
                    </span>
                  )}
                  <div className="body">
                    <span className="title">{title}</span>
                    {category && <span className="tag">{category}</span>}
                  </div>
                  <span className="date">{fmtDate(node.fields.date)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="cell full" id="work">
          <div className="cell-head">
            <div className="cell-label">Work</div>
            <a
              className="view-all"
              href="https://github.com/AhmadIbrahiim"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          </div>
          <div className="work-grid">
            {projects.map(project => (
              <a
                className="wrow"
                key={project.title}
                href={project.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="body">
                  <span className="name">{project.title}</span>
                  {project.description && (
                    <span className="blurb">{project.description}</span>
                  )}
                </div>
                <span className="m">
                  {PROJECT_META[project.title] || 'Visit'}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export function Head() {
  return <SEO title={`${config.siteTitle} – Senior Software Engineer · Voice AI`} />
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 5
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 240)
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 60, height: 60, layout: FIXED, placeholder: BLURRED)
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
