const path = require('path')
const kebabCase = require('lodash.kebabcase')
const sass = require('sass')

const replaceSassLoader = rules =>
  rules.map(rule => {
    const nextRule = { ...rule }

    if (Array.isArray(rule.use)) {
      nextRule.use = rule.use.map(loaderConfig => {
        if (
          loaderConfig &&
          typeof loaderConfig === 'object' &&
          typeof loaderConfig.loader === 'string' &&
          loaderConfig.loader.includes('sass-loader')
        ) {
          return {
            ...loaderConfig,
            loader: require.resolve('sass-loader'),
            options: {
              ...loaderConfig.options,
              api: 'modern-compiler',
              implementation: sass,
            },
          }
        }

        return loaderConfig
      })
    }

    if (Array.isArray(rule.oneOf)) {
      nextRule.oneOf = replaceSassLoader(rule.oneOf)
    }

    if (Array.isArray(rule.rules)) {
      nextRule.rules = replaceSassLoader(rule.rules)
    }

    return nextRule
  })

exports.onCreateNode = ({ actions, getNode, node }) => {
  const { createNodeField } = actions

  if (node.internal.type !== 'MarkdownRemark') {
    return
  }

  const fileNode = getNode(node.parent)
  const parsedFilePath = path.parse(fileNode.relativePath)
  let slug

  if (Object.prototype.hasOwnProperty.call(node, 'frontmatter') && node.frontmatter.title) {
    slug = `/${kebabCase(node.frontmatter.title)}/`
  } else if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
    slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`
  } else if (parsedFilePath.dir === '') {
    slug = `/${parsedFilePath.name}/`
  } else {
    slug = `/${parsedFilePath.dir}/`
  }

  if (node.frontmatter?.slug) {
    slug = `/${node.frontmatter.slug}/`
  }

  if (node.frontmatter?.date) {
    createNodeField({
      name: 'date',
      node,
      value: new Date(node.frontmatter.date).toISOString(),
    })
  }

  createNodeField({ name: 'slug', node, value: slug })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const postPage = path.resolve('src/templates/post.js')
  const pagePage = path.resolve('src/templates/page.js')
  const tagPage = path.resolve('src/templates/tag.js')
  const categoryPage = path.resolve('src/templates/category.js')

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              tags
              categories
              template
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('Error while creating pages', result.errors)
    return
  }

  const tagSet = new Set()
  const categorySet = new Set()

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    node.frontmatter.tags?.forEach(tag => tagSet.add(tag))
    node.frontmatter.categories?.forEach(category => categorySet.add(category))

    if (node.frontmatter.template === 'post') {
      createPage({
        component: postPage,
        context: {
          slug: node.fields.slug,
        },
        path: node.fields.slug,
      })
    }

    if (node.frontmatter.template === 'page') {
      // /me/ is rendered by src/pages/me.js as a custom "living document"
      if (node.fields.slug === '/me/') return

      createPage({
        component: pagePage,
        context: {
          slug: node.fields.slug,
        },
        path: node.fields.slug,
      })
    }
  })

  Array.from(tagSet).forEach(tag => {
    createPage({
      component: tagPage,
      context: {
        tag,
      },
      path: `/tags/${kebabCase(tag)}/`,
    })
  })

  Array.from(categorySet).forEach(category => {
    createPage({
      component: categoryPage,
      context: {
        category,
      },
      path: `/categories/${kebabCase(category)}/`,
    })
  })
}

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig()

  config.module.rules = replaceSassLoader(config.module.rules)
  actions.replaceWebpackConfig(config)
}
