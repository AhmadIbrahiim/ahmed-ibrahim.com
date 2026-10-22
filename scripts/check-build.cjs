// Run after npm run build. No server or extra dependencies needed.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const output = path.join(root, 'public')
const read = name => fs.readFileSync(path.join(output, name), 'utf8')
const home = read('index.html')
assert.match(home, /I build /, 'Homepage must render on the server')
assert.match(home, /id="agent-slot"/, 'Homepage must reserve space for the voice assistant')
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
for (const route of ['blog', 'me', 'contact', 'tags', 'categories', 'learn', 'voice-ai-engineer']) {
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

const service = read('voice-ai-engineer/index.html')
assert.equal((service.match(/<h1[ >]/g) || []).length, 1, 'Service page needs one main heading')
for (const text of ['Build a voice agent', 'individual contributor', 'LiveKit', 'Goodcall', 'Can I hire you', 'not measured timing']) {
  assert.ok(service.includes(text), `Service content must be readable without JavaScript: ${text}`)
}
assert.ok(home.includes('href="/voice-ai-engineer/"'), 'Homepage must link to the service page')
assert.ok(service.includes('mailto:me@ahmed-ibrahim.com?subject=Voice%20agent%20project'), 'Project inquiry link missing')
assert.ok(service.includes('href="#project-inquiry"'), 'Project CTA must reach the visible contact section')
assert.ok(service.includes('id="project-inquiry"'), 'Project contact section must exist')
const emailLink = service.match(/href="(mailto:me@ahmed-ibrahim\.com\?[^\"]+)"/)[1].replaceAll('&amp;', '&').replaceAll('&#x27;', "'")
const gmailLink = service.match(/href="(https:\/\/mail\.google\.com\/mail\/\?[^\"]+)"/)[1].replaceAll('&amp;', '&').replaceAll('&#x27;', "'")
const emailDraft = new URL(emailLink)
const gmailDraft = new URL(gmailLink)
assert.equal(gmailDraft.searchParams.get('to'), 'me@ahmed-ibrahim.com', 'Gmail draft recipient must be Ahmed')
assert.equal(gmailDraft.searchParams.get('su'), emailDraft.searchParams.get('subject'), 'Draft subjects must match')
assert.equal(gmailDraft.searchParams.get('body'), emailDraft.searchParams.get('body'), 'Draft bodies must match')
for (const prompt of ['What the agent should do:', 'current stack:', 'Where we need help:', 'Timeline:', 'Budget (if known):']) {
  assert.ok(emailDraft.searchParams.get('body').includes(prompt), `Project draft prompt missing: ${prompt}`)
}
assert.ok(emailDraft.searchParams.get('body').includes('\n\n'), 'Project draft must preserve paragraph breaks')
const jsonld = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]))
const entities = jsonld(service)
const person = entities.find(entity => entity['@type'] === 'Person')
const offering = entities.find(entity => entity['@type'] === 'Service')
assert.equal(person.name, 'Ahmed Ibrahim', 'Person identity missing')
assert.equal(offering.provider['@id'], person['@id'], 'Service must reference the same person')
assert.equal(offering.url, 'https://www.ahmed-ibrahim.com/voice-ai-engineer', 'Service URL must match the canonical')
assert.equal(jsonld(home).filter(entity => entity['@type'] === 'Person').length, 1, 'Homepage must identify one person')
const robots = read('robots.txt')
const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)/m)?.[1]
assert.ok(sitemapUrl, 'robots.txt must advertise a sitemap')
assert.ok(fs.existsSync(path.join(output, new URL(sitemapUrl).pathname)), 'Advertised sitemap must exist')
const sitemapFiles = fs.readdirSync(output).filter(name => /^sitemap.*\.xml$/.test(name))
assert.ok(sitemapFiles.some(name => read(name).includes('/voice-ai-engineer/')), 'Service page missing from sitemap')
assert.ok(read('llms.txt').includes('https://www.ahmed-ibrahim.com/voice-ai-engineer/'), 'LLM directory must link to the service page')
console.log(`Build check passed: ${articles} original articles, their RSS entries, supporting pages, archives, portrait, and controls.`)
