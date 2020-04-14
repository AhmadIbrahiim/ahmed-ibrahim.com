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
    'Ahmed Ibrahim is a full stack software engineer.',
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
