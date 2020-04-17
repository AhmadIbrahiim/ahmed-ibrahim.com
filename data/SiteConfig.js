const config = {
  siteTitle: 'Ahmed Ibrahim',
  siteTitleShort: 'Ahmed Ibrahim',
  siteTitleAlt: 'Ahmed Ibrahim',
  siteLogo: '/logos/logo-1024.png',
  siteUrl: 'https://www.ahmed-ibrahim.com',
  repo: 'https://github.com/ahmedibrahhim/ahmed-ibrahim.com',
  pathPrefix: '',
  dateFromFormat: 'YYYY-MM-DD',
  dateFormat: 'MMMM Do, YYYY',
  siteDescription:
    'I\'m a full stack software engineer with 3 years of experience with Node.js. I do believe that anyone can master how to write better code, But ideas and passion cannot be gained that easy, based on my co-workers my strengths is the ability to produce ideas and passion. My forever favorite quote: DO IT WITH PASSION OR NOT AT ALL.',
  siteRss: '/rss.xml',
  googleAnalyticsID: 'UA-42068444-1',
  postDefaultCategoryID: 'Tech',
  userName: 'AhmedIbrahim',
  userEmail: 'me@ahmed-ibrahim.com',
  userTwitter: 'ahmed_ibrahhim',
  menuLinks: [
    {
      name: 'About me',
      link: '/me/',
    },
    {
      name: 'Articles',
      link: '/blog/',
    },
    {
      name: 'Contact',
      link: '/contact/',
    },
  ],
  themeColor: '#3F80FF', // Used for setting manifest and progress theme colors.
  backgroundColor: '#ffffff',
}

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`

module.exports = config
