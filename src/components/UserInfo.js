import React, { Component } from 'react'
import Ahmed from '../../content/images/profile.jpg'
import patreon from '../../content/thumbnails/patreon.png'
import kofi from '../../content/thumbnails/kofi.png'

export default class UserInfo extends Component {
  render() {
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={Ahmed} alt="Ahmed Ibrahim" />
            </div>
            <div>
              <p>
                I’m Ahmed Ibrahim. I believe that is passion can make do anything. If you want to reach me email me 🖥️
                <strong>
                 Me@ahmed-ibrahim.com
                </strong>
              </p>

           
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
