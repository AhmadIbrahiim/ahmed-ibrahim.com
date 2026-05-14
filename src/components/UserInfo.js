import React from 'react'
import Ahmed from '../../content/images/profile-small.jpg'

export default function UserInfo() {
  return (
    <aside className="user-info">
      <div className="user-info-photo">
        <img src={Ahmed} alt="Ahmed Ibrahim" />
      </div>
      <div className="user-info-body">
        <div className="user-info-label">Written by</div>
        <p>
          <strong>Ahmed Ibrahim</strong> — Senior Software Engineer at Goodcall,
          building voice AI &amp; LLM systems.
        </p>
        <p>
          Reach me at{' '}
          <a href="mailto:me@ahmed-ibrahim.com">me@ahmed-ibrahim.com</a>.
        </p>
      </div>
    </aside>
  )
}
