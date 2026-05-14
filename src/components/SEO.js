import React from 'react'
import { getSrc } from 'gatsby-plugin-image'
import config from '../../data/SiteConfig'
import favicon from '../images/favicon.png'

const replacePath = path => (path === '/' ? path : path.replace(/\/$/, ''))
const joinUrl = (...parts) =>
  parts
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part.replace(/\/+$/g, '') : part.replace(/^\/+|\/+$/g, '')
    )
    .join('/')

const getImageSource = imageNode => {
  if (!imageNode) {
    return ''
  }

  return (
    getSrc(imageNode) ||
    imageNode.childImageSharp?.gatsbyImageData?.images?.fallback?.src ||
    imageNode.publicURL ||
    ''
  )
}

export default function SEO({
  description: providedDescription,
  postNode,
  postPath = '/',
  postSEO = false,
  title: providedTitle,
}) {
  const siteURL = joinUrl(config.siteUrl, config.pathPrefix)
  const pageURL = postSEO ? joinUrl(config.siteUrl, replacePath(postPath)) : siteURL
  const pageTitle = providedTitle || config.siteTitle
  let description = providedDescription || config.siteDescription
  let image = config.siteLogo

  if (postSEO && postNode) {
    const postMeta = postNode.frontmatter

    description = providedDescription || postMeta.description || postNode.excerpt
    image =
      getImageSource(postMeta.seoImage) ||
      getImageSource(postMeta.thumbnail) ||
      config.siteLogo
  }

  const absoluteImage = image.startsWith('http') ? image : joinUrl(config.siteUrl, image)
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      alternateName: config.siteTitleAlt || '',
      name: config.siteTitle,
      url: siteURL,
    },
  ]

  if (postSEO) {
    schemaOrgJSONLD.push(
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            item: {
              '@id': pageURL,
              image: absoluteImage,
              name: pageTitle,
            },
            position: 1,
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        alternateName: config.siteTitleAlt || '',
        description,
        headline: pageTitle,
        image: {
          '@type': 'ImageObject',
          url: absoluteImage,
        },
        name: pageTitle,
        url: pageURL,
      }
    )
  }

  return (
    <>
      <html lang="en" />
      <title>{pageTitle}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
      />
      <link rel="icon" type="image/png" href={favicon} />
      <meta name="description" content={description} />
      <meta name="image" content={absoluteImage} />
      <meta property="og:url" content={pageURL} />
      {postSEO && <meta property="og:type" content="article" />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.userTwitter} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>
    </>
  )
}
