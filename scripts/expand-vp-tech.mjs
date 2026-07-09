/**
 * Expand VitePress-specific markdown syntax in docs/article/tech
 * into standard markdown for AstroPaper (.content/tech).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { glob, globSync } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(ROOT, 'docs')
const TECH_SRC = path.join(DOCS_DIR, 'article', 'tech')
const TECH_OUT = path.join(ROOT, 'apps', 'blog', '.content', 'tech')

const SNIPPET_RE = /^[ \t]*<<< (.+?)[ \t]*$/gm

/** @param {string} token */
function parseSnippetToken(token) {
  let rest = token.trim()
  let filePath = rest
  let region
  let modifiers = ''

  const braceIdx = rest.indexOf('{')
  if (braceIdx !== -1) {
    modifiers = rest.slice(braceIdx + 1, rest.lastIndexOf('}'))
    rest = rest.slice(0, braceIdx)
  }

  const hashIdx = rest.indexOf('#')
  if (hashIdx !== -1) {
    filePath = rest.slice(0, hashIdx)
    region = rest.slice(hashIdx + 1)
  } else {
    filePath = rest
  }

  return { filePath: filePath.trim(), region, modifiers }
}

/** @param {string} modifiers */
function parseModifiers(modifiers) {
  if (!modifiers) return { lang: '' }
  const parts = modifiers.trim().split(/\s+/)
  const langPattern = /^[a-z#+\-]+$/i
  let lang = ''
  for (const part of parts) {
    const base = part.split(':')[0]
    if (langPattern.test(base) && !/^\d/.test(base)) {
      lang = base
    }
  }
  return { lang }
}

/** @param {string} filePath */
function guessLang(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const map = {
    js: 'js',
    jsx: 'jsx',
    ts: 'ts',
    tsx: 'tsx',
    py: 'python',
    sh: 'bash',
    bash: 'bash',
    html: 'html',
    vue: 'vue',
    scss: 'scss',
    css: 'css',
    json: 'json',
    md: 'md',
  }
  return map[ext] || ext
}

/**
 * @param {string} content
 * @param {string} region
 */
function extractRegion(content, region) {
  const name = escapeRegExp(region)
  const patterns = [
    new RegExp(
      `//\\s*#reg(?:ion|in)\\s+${name}[\\s\\S]*?//\\s*#endreg(?:ion|in)\\s+${name}`,
      'm'
    ),
    new RegExp(
      `#\\s*region\\s+${name}[\\s\\S]*?#\\s*endregion\\s+${name}`,
      'm'
    ),
    new RegExp(
      `<!--\\s*#reg(?:ion|in)\\s+${name}\\s*-->[\\s\\S]*?<!--\\s*#endreg(?:ion|in)\\s+${name}\\s*-->`,
      'm'
    ),
  ]

  for (const re of patterns) {
    const match = content.match(re)
    if (match) {
      return stripRegionMarkers(match[0])
    }
  }

  return null
}

function stripRegionMarkers(block) {
  return block
    .replace(/^\s*\/\/\s*#reg(?:ion|in)\s+[^\n]*\n?/i, '')
    .replace(/\n?\s*\/\/\s*#endreg(?:ion|in)\s+[^\n]*\s*$/i, '')
    .replace(/^\s*#\s*region\s+[^\n]*\n?/i, '')
    .replace(/\n?\s*#\s*endregion\s+[^\n]*\s*$/i, '')
    .replace(/^\s*<!--\s*#reg(?:ion|in)[^>]*-->\s*\n?/i, '')
    .replace(/\n?\s*<!--\s*#endreg(?:ion|in)[^>]*-->\s*$/i, '')
    .trim()
}

/** @param {string} absPath @param {string} region */
function findRegionInSubmodule(absPath, region) {
  const normalized = absPath.replace(/\\/g, '/')
  const submoduleMatch = normalized.match(/(.*\/submodule\/[^/]+)/)
  const searchRoot = submoduleMatch ? submoduleMatch[1] : path.dirname(absPath)

  const files = globSync('**/*.{ts,js,mjs,cjs,vue,html,py,jsx,tsx,scss,css}', {
    cwd: searchRoot,
    nodir: true,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const extracted = extractRegion(content, region)
    if (extracted) return extracted
  }

  return null
}

/** @param {string} content @param {string} region */
function extractLinesContaining(content, region) {
  const lines = content.split('\n')
  const hits = lines.filter((line) => line.includes(region))
  if (hits.length > 0) {
    return hits.join('\n')
  }
  return null
}

/**
 * @param {string} content
 * @param {string} region
 * @param {string} absPath
 */
function extractFunctionByRegionAlias(content, region) {
  /** @type {Record<string, string>} */
  const aliasMap = {
    'node-stream': 'sendFileByNodeStream',
    'web-stream': 'sendFileByWebStream',
  }
  const fnName = aliasMap[region]
  if (!fnName) return null

  const startRe = new RegExp(
    `(?:/\\*\\*[\\s\\S]*?\\*/\\s*)?(?:async\\s+)?function\\s+${fnName}\\s*\\(`
  )
  const startMatch = startRe.exec(content)
  if (!startMatch) return null

  return extractBalancedBlock(content, startMatch.index)
}

/** @param {string} content @param {number} startIndex */
function extractBalancedBlock(content, startIndex) {
  const braceStart = content.indexOf('{', startIndex)
  if (braceStart === -1) return null

  let depth = 0
  for (let i = braceStart; i < content.length; i++) {
    const ch = content[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        return content.slice(startIndex, i + 1).trim()
      }
    }
  }
  return null
}

/**
 * @param {string} content
 * @param {string} region
 * @param {string} absPath
 */
function resolveRegionContent(content, region, absPath) {
  const inFile = extractRegion(content, region)
  if (inFile) return inFile

  const inSubmodule = findRegionInSubmodule(absPath, region)
  if (inSubmodule) return inSubmodule

  const byFunctionAlias = extractFunctionByRegionAlias(content, region)
  if (byFunctionAlias) return byFunctionAlias

  const byKeyword = extractLinesContaining(content, region)
  if (byKeyword) return byKeyword

  throw new Error(
    `Region "${region}" not found in ${absPath} (also searched submodule tree)`
  )
}

/** @param {string} s */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * @param {string} filePath
 * @param {string} mdDir
 */
function resolveSnippetPath(filePath, mdDir) {
  if (filePath.startsWith('@/')) {
    return path.join(DOCS_DIR, filePath.slice(2))
  }
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return path.resolve(mdDir, filePath)
  }
  return path.resolve(mdDir, filePath)
}

/**
 * @param {string} body
 * @param {string} mdFilePath
 */
function expandSnippets(body, mdFilePath) {
  const mdDir = path.dirname(mdFilePath)

  return body.replace(SNIPPET_RE, (_, rawToken) => {
    const { filePath, region, modifiers } = parseSnippetToken(rawToken)
    const absPath = resolveSnippetPath(filePath, mdDir)

    if (!fs.existsSync(absPath)) {
      throw new Error(`Snippet file not found: ${absPath}\n  referenced from ${mdFilePath}`)
    }

    let code = fs.readFileSync(absPath, 'utf8')
    if (region) {
      code = resolveRegionContent(code, region, absPath)
    }

    const { lang: modLang } = parseModifiers(modifiers)
    const lang = modLang || guessLang(absPath)
    const fence = lang ? '```' + lang : '```'
    return `${fence}\n${code.trimEnd()}\n\`\`\``
  })
}

/** @param {string} body */
function extractDescription(body) {
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('<')) continue
    if (trimmed.startsWith('```')) continue
    if (trimmed.startsWith('<<<')) continue
    const text = trimmed.replace(/[*_`>]/g, '').trim()
    if (text.length > 0) {
      return text.length > 160 ? text.slice(0, 157) + '...' : text
    }
  }
  return ''
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} body
 */
function transformFrontmatter(data, body) {
  if (data.astro === false) {
    return null
  }

  const title = String(data.title || '')
  const date = data.date || data.pubDatetime
  if (!title || !date) {
    throw new Error(`Missing title or date in frontmatter`)
  }

  const description =
    typeof data.description === 'string' ? data.description : ''

  return {
    title,
    pubDatetime: new Date(date),
    description,
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: Boolean(data.draft),
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function cleanOutputDir() {
  if (fs.existsSync(TECH_OUT)) {
    fs.rmSync(TECH_OUT, { recursive: true, force: true })
  }
  ensureDir(TECH_OUT)
}

async function main() {
  const files = await glob('**/index.md', {
    cwd: TECH_SRC,
    posix: true,
  })

  cleanOutputDir()

  let written = 0
  let skipped = 0
  const manifest = []

  for (const rel of files.sort()) {
    const srcPath = path.join(TECH_SRC, rel)
    const { data, content } = matter(fs.readFileSync(srcPath, 'utf8'))

    if (data.astro === false) {
      skipped++
      console.log(`skip (astro: false): ${rel}`)
      continue
    }

    const fm = transformFrontmatter(data, content)
    if (!fm) {
      skipped++
      continue
    }

    const expandedBody = expandSnippets(content, srcPath)
    const outPath = path.join(TECH_OUT, rel)
    ensureDir(path.dirname(outPath))

    const output = matter.stringify(expandedBody, fm)
    fs.writeFileSync(outPath, output, 'utf8')
    written++

    const slug = rel.replace(/\/index\.md$/, '')
    manifest.push({
      slug,
      title: fm.title,
      pubDatetime: fm.pubDatetime.toISOString().slice(0, 10),
      tags: fm.tags,
      description: fm.description,
    })

    console.log(`expanded: ${rel}`)
  }

  const manifestPath = path.join(TECH_OUT, 'manifest.json')
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      manifest.sort(
        (a, b) => new Date(b.pubDatetime) - new Date(a.pubDatetime)
      ),
      null,
      2
    ),
    'utf8'
  )

  console.log(`\nDone: ${written} written, ${skipped} skipped`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
