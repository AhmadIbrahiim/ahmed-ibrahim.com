// Run after npm run build. No server or extra dependencies needed.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const output = path.join(root, 'public')
const read = name => fs.readFileSync(path.join(output, name), 'utf8')
const home = read('index.html')
assert.match(home, /I build /, 'Homepage must render on the server')
assert.match(home, /aria-label="Animate waveform"/, 'Waveform must have an accessible control')
assert.match(home, /aria-controls="pipeline-detail"/, 'Pipeline controls must target their explanation')
assert.match(home, /id="main-content"/, 'Skip link must have a target')
assert.ok(fs.statSync(path.join(output, 'images/ahmed-pixel.png')).size > 0, 'Portrait must be shipped')
for (const pose of ['listening', 'building', 'writing', 'waving', 'contact']) {
  const asset = `images/ahmed-${pose}.png`
  const png = fs.readFileSync(path.join(output, asset))
  assert.equal(png.toString('hex', 0, 8), '89504e470d0a1a0a', `Invalid PNG: ${pose}`)
  assert.ok(home.includes(asset), `Static portrait is not rendered: ${pose}`)
  assert.ok(home.includes(`pixel-pose--${pose}`), `Homepage pose missing: ${pose}`)
}
assert.ok(!home.includes('data-playing="true"'), 'Characters must remain still until interaction')
assert.ok(!home.includes('-sprite.png'), 'Portraits must use static images')
assert.ok(!home.includes('pose-replay'), 'Portrait replay controls must be removed')

let articles = 0
for (const name of fs.readdirSync(path.join(root, 'content/posts'))) {
  if (!name.endsWith('.md')) continue
  const source = fs.readFileSync(path.join(root, 'content/posts', name), 'utf8')
  const slug = source.match(/^slug:\s*(.+)$/m)?.[1].trim()
  assert.ok(slug, `Missing explicit slug: ${name}`)
  const html = read(`${slug}/index.html`)
  assert.ok(html.includes(`/edit/master/content/posts/${encodeURIComponent(name)}`), `Source link does not match the original file: ${name}`)
  assert.match(html, /class="post-body"/, `Article body missing: ${slug}`)
  assert.match(html, /class="post-header"/, `Article header missing: ${slug}`)
  assert.ok(html.includes(`https://www.ahmed-ibrahim.com/${slug}`), `Canonical missing: ${slug}`)
  assert.ok(read('rss.xml').includes(`/${slug}/`), `RSS entry missing: ${slug}`)
  articles += 1
}
for (const route of ['blog', 'me', 'contact', 'tags', 'categories', 'learn']) {
  const html = read(`${route}/index.html`)
  assert.match(html, /<h1/, `Page heading missing: ${route}`)
  assert.ok(html.includes(`href="https://www.ahmed-ibrahim.com/${route}"`), `Canonical missing: ${route}`)
}
for (const index of ['tags', 'categories']) {
  for (const entry of fs.readdirSync(path.join(output, index), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const html = read(`${index}/${entry.name}/index.html`)
    assert.match(html, /class="posts-list"/, `Archive list missing: ${entry.name}`)
    assert.ok(html.includes(`href="https://www.ahmed-ibrahim.com/${index}/${entry.name}"`), `Archive canonical missing: ${entry.name}`)
  }
}
assert.match(read('404.html'), /Lost the signal/, 'Custom 404 missing')
assert.ok(fs.existsSync(path.join(output, 'sitemap-index.xml')), 'Sitemap missing')
console.log(`Build check passed: ${articles} original articles, their RSS entries, supporting pages, archives, portrait, and controls.`)
