import React, { Component } from 'react'
import Ahmed from '../../content/images/profile.jpg'


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
                I'm Ahmed Ibrahim, Software Engineer with +3 years of experience. My forever quote <i>Do it with passion or not at all</i>. <br></br>If you want to reach me, Drop me an email  🖥️
                <strong>
                 me@ahmed-ibrahim.com
                </strong>
              </p>

           
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
