import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const html = await readFile('dist/index.html', 'utf8')
const metadata = JSON.parse(await readFile('src/lib/pageMetadata.json', 'utf8'))

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

await copyFile('dist/index.html', 'dist/404.html')

for (const [slug, meta] of Object.entries(metadata)) {
  if (!slug) continue
  const title = escapeHtml(meta.metaTitle)
  const description = escapeHtml(meta.metaDescription)
  const page = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
  const directory = join('dist', slug)
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), page, 'utf8')
}
