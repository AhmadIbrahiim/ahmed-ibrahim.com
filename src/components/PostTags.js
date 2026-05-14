import React from 'react'
import kebabCase from 'lodash.kebabcase'
import { Link } from 'gatsby'

export default function PostTags({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="post-tags" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
      {tags.map(tag => (
        <Link
          key={tag}
          to={`/tags/${kebabCase(tag)}/`}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '1.5px solid #000',
            padding: '4px 8px',
            color: '#000',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
