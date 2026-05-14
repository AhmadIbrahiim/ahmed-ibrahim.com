import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const formatDate = iso => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const initialsFor = title =>
  title
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export default function PostListing({ postEdges }) {
  return (
    <ul className="posts-list">
      {postEdges.map(({ node }) => {
        const thumb = getImage(node.frontmatter.thumbnail)
        const title = node.frontmatter.title
        return (
          <li key={node.fields.slug}>
            {thumb ? (
              <GatsbyImage image={thumb} alt="" />
            ) : (
              <span className="thumb-fallback" aria-hidden="true">
                {initialsFor(title)}
              </span>
            )}
            <Link to={node.fields.slug}>{title}</Link>
            <span className="date">{formatDate(node.fields.date)}</span>
          </li>
        )
      })}
    </ul>
  )
}
