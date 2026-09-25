import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SITE_URL = 'https://masqueurticaria.org'
// Solo el build de producción se deja indexar: SITE_INDEXABLE=true pnpm build
const indexable = process.env.SITE_INDEXABLE === 'true'

let html = await readFile('dist/index.html', 'utf8')
const metadata = JSON.parse(await readFile('src/lib/pageMetadata.json', 'utf8'))

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

if (indexable) html = html.replace(/\s*<!--[^>]*SITE_INDEXABLE[^>]*-->\s*<meta name="robots"[^>]*>/, '')

function pageHtml(slug, meta) {
  const title = escapeHtml(meta.metaTitle)
  const description = escapeHtml(meta.metaDescription)
  const url = `${SITE_URL}/${slug ? `${slug}/` : ''}`
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${url}" />`)
}

await writeFile('dist/index.html', pageHtml('', metadata['']), 'utf8')
await copyFile('dist/index.html', 'dist/404.html')

for (const [slug, meta] of Object.entries(metadata)) {
  if (!slug) continue
  const directory = join('dist', slug)
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), pageHtml(slug, meta), 'utf8')
}
