import React, { Component } from 'react'
import { Link } from 'gatsby'
import netlify from '../../content/images/netlify.png'
import gatsby from '../../content/thumbnails/gatsby.png'
import github from '../../content/images/github.png'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <div>
          <a href="https://twitter.com/ahmed_ibrahim" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
    
          <Link to="/contact">Contact me</Link>
          <a href="https://www.ahmed-ibrahim.com/rss.xml" target="_blank" rel="noopener noreferrer">
            RSS
          </a>
        </div>
        <div>
          <a href="https://github.com/AhmadIbrahiim" title="Open-source on GitHub">
            <img
              src={github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
          <a href="https://www.gatsbyjs.org/" title="Built with Gatsby">
            <img
              src={gatsby}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
        </div>
      </footer>
    )
  }
}
