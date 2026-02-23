import { XMLParser } from 'fast-xml-parser'

import type { FeedCategory, FeedImage, FeedItem, FeedLink, FeedMedia, ParsedFeed } from './types.js'
import { ensureArray, firstText } from './utils.js'

type FeedNode = Record<string, unknown>

interface FieldTemplate<T extends object> {
  extract: (node: FeedNode) => unknown
  key: keyof T
}

interface NodeTemplate<T extends object> {
  defaults?: Partial<T>
  fields: ReadonlyArray<FieldTemplate<T>>
}

interface FeedTemplateConfig {
  copyrightPaths?: readonly string[]
  descriptionPaths?: readonly string[]
  generatorPaths?: readonly string[]
  idPaths?: readonly string[]
  imagePaths?: readonly string[]
  languagePaths?: readonly string[]
  linkPaths: readonly string[]
  publishedPaths?: readonly string[]
  titlePaths: readonly string[]
  ttlPaths?: readonly string[]
  updatedPaths?: readonly string[]
}

interface ItemTemplateConfig {
  authorPaths?: readonly string[]
  categoryPaths?: readonly string[]
  idPaths?: readonly string[]
  linkPaths: readonly string[]
  publishedPaths?: readonly string[]
  summaryPaths?: readonly string[]
  titlePaths: readonly string[]
  updatedPaths?: readonly string[]
}

function asRecord(value: unknown): FeedNode | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  return value as FeedNode
}

function getPath(node: FeedNode, path: string): unknown {
  const segments = path.split('.')
  let current: unknown = node

  for (const segment of segments) {
    if (Array.isArray(current)) {
      current = current[0]
    }

    const record = asRecord(current)
    if (!record) {
      return undefined
    }

    current = record[segment]
  }

  return current
}

function firstTextFromPaths(node: FeedNode, paths: readonly string[]): string | undefined {
  for (const path of paths) {
    const value = firstText(getPath(node, path))
    if (value) {
      return value
    }
  }

  return undefined
}

function toLinks(value: unknown): FeedLink[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => toLinks(entry))
  }

  const record = asRecord(value)
  if (record) {
    const href = firstText(record['@_href']) ?? firstText(record.href) ?? firstText(value)
    if (!href) {
      return []
    }

    const rel = firstText(record['@_rel']) ?? firstText(record.rel)
    const type = firstText(record['@_type']) ?? firstText(record.type)

    return [
      {
        href,
        ...(rel ? { rel } : {}),
        ...(type ? { type } : {}),
      },
    ]
  }

  const directLink = firstText(value)
  return directLink ? [{ href: directLink }] : []
}

function linksFromPaths(node: FeedNode, paths: readonly string[]): FeedLink[] | undefined {
  const links: FeedLink[] = []
  const seen = new Set<string>()

  for (const path of paths) {
    const candidates = toLinks(getPath(node, path))
    for (const candidate of candidates) {
      const key = `${candidate.href}|${candidate.rel ?? ''}|${candidate.type ?? ''}`
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      links.push(candidate)
    }
  }

  return links.length > 0 ? links : undefined
}

function selectPrimaryLink(links: FeedLink[]): string | undefined {
  if (links.length === 0) {
    return undefined
  }

  const preferred =
    links.find(
      (link) => link.rel === undefined || link.rel === 'alternate' || link.rel === 'standout',
    ) ?? links[0]

  return preferred?.href
}

function primaryLinkFromPaths(node: FeedNode, paths: readonly string[]): string | undefined {
  const links = linksFromPaths(node, paths)
  if (!links) {
    return undefined
  }

  return selectPrimaryLink(links)
}

function parseAuthor(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const authors = value
      .map((entry) => parseAuthor(entry))
      .filter((entry): entry is string => Boolean(entry))
    return authors.length > 0 ? authors.join(', ') : undefined
  }

  const direct = firstText(value)
  if (direct) {
    return direct
  }

  const record = asRecord(value)
  if (!record) {
    return undefined
  }

  return firstText(record.name) ?? firstText(record.email) ?? firstText(record.uri)
}

function authorFromPaths(node: FeedNode, paths: readonly string[]): string | undefined {
  for (const path of paths) {
    const author = parseAuthor(getPath(node, path))
    if (author) {
      return author
    }
  }

  return undefined
}

function parseCategories(value: unknown): FeedCategory[] | undefined {
  const categories: FeedCategory[] = []
  const seen = new Set<string>()

  for (const rawCategory of ensureArray(value as unknown | unknown[] | undefined)) {
    const record = asRecord(rawCategory)
    const name =
      firstText(rawCategory) ??
      firstText(record?.['@_term']) ??
      firstText(record?.term) ??
      firstText(record?.name)

    if (!name) {
      continue
    }

    const domain = firstText(record?.['@_domain']) ?? firstText(record?.domain)
    const scheme = firstText(record?.['@_scheme']) ?? firstText(record?.scheme)
    const label = firstText(record?.['@_label']) ?? firstText(record?.label)
    const key = `${name}|${domain ?? ''}|${scheme ?? ''}|${label ?? ''}`

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    categories.push({
      name,
      ...(domain ? { domain } : {}),
      ...(scheme ? { scheme } : {}),
      ...(label ? { label } : {}),
    })
  }

  return categories.length > 0 ? categories : undefined
}

function categoriesFromPaths(node: FeedNode, paths: readonly string[]): FeedCategory[] | undefined {
  const categories: FeedCategory[] = []
  const seen = new Set<string>()

  for (const path of paths) {
    const pathCategories = parseCategories(getPath(node, path))
    if (!pathCategories) {
      continue
    }

    for (const category of pathCategories) {
      const key = `${category.name}|${category.domain ?? ''}|${category.scheme ?? ''}|${category.label ?? ''}`
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      categories.push(category)
    }
  }

  return categories.length > 0 ? categories : undefined
}

function parseMediaContent(
  value: unknown,
  fallbackCredit?: string,
  fallbackDescription?: string,
): FeedMedia | undefined {
  const record = asRecord(value)
  const url = firstText(record?.['@_url']) ?? firstText(record?.url) ?? firstText(value)
  const medium = firstText(record?.['@_medium']) ?? firstText(record?.medium)
  const type = firstText(record?.['@_type']) ?? firstText(record?.type)
  const width = firstText(record?.['@_width']) ?? firstText(record?.width)
  const height = firstText(record?.['@_height']) ?? firstText(record?.height)
  const credit = firstText(record?.['media:credit']) ?? firstText(record?.credit) ?? fallbackCredit
  const description =
    firstText(record?.['media:description']) ??
    firstText(record?.description) ??
    fallbackDescription

  if (!url && !medium && !type && !width && !height && !credit && !description) {
    return undefined
  }

  return {
    ...(url ? { url } : {}),
    ...(medium ? { medium } : {}),
    ...(type ? { type } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(credit ? { credit } : {}),
    ...(description ? { description } : {}),
  }
}

function mediaFromNode(node: FeedNode): FeedMedia[] | undefined {
  const fallbackCredit = firstTextFromPaths(node, ['media:credit', 'media:group.media:credit'])
  const fallbackDescription = firstTextFromPaths(node, [
    'media:description',
    'media:group.media:description',
  ])
  const mediaCandidates = [
    ...ensureArray(getPath(node, 'media:content') as unknown | unknown[] | undefined),
    ...ensureArray(getPath(node, 'media:group.media:content') as unknown | unknown[] | undefined),
  ]

  const media = mediaCandidates
    .map((candidate) => parseMediaContent(candidate, fallbackCredit, fallbackDescription))
    .filter((candidate): candidate is FeedMedia => Boolean(candidate))

  if (media.length === 0 && (fallbackCredit || fallbackDescription)) {
    return [
      {
        ...(fallbackCredit ? { credit: fallbackCredit } : {}),
        ...(fallbackDescription ? { description: fallbackDescription } : {}),
      },
    ]
  }

  if (media.length === 0) {
    return undefined
  }

  const deduped: FeedMedia[] = []
  const seen = new Set<string>()

  for (const item of media) {
    const key = `${item.url ?? ''}|${item.medium ?? ''}|${item.type ?? ''}|${item.width ?? ''}|${item.height ?? ''}|${item.credit ?? ''}|${item.description ?? ''}`
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    deduped.push(item)
  }

  return deduped
}

function parseImage(value: unknown): FeedImage | undefined {
  if (Array.isArray(value)) {
    for (const candidate of value) {
      const image = parseImage(candidate)
      if (image) {
        return image
      }
    }

    return undefined
  }

  const record = asRecord(value)
  if (!record) {
    const url = firstText(value)
    return url ? { url } : undefined
  }

  const url = firstText(record['@_url']) ?? firstText(record.url)
  const title = firstText(record.title)
  const link = firstText(record.link)

  if (!url && !title && !link) {
    return undefined
  }

  return {
    ...(url ? { url } : {}),
    ...(title ? { title } : {}),
    ...(link ? { link } : {}),
  }
}

function imageFromPaths(node: FeedNode, paths: readonly string[]): FeedImage | undefined {
  for (const path of paths) {
    const image = parseImage(getPath(node, path))
    if (image) {
      return image
    }
  }

  return undefined
}

function textField<T extends object>(key: keyof T, paths: readonly string[]): FieldTemplate<T> {
  return {
    key,
    extract: (node) => firstTextFromPaths(node, paths),
  }
}

function applyTemplate<T extends object>(
  node: FeedNode,
  templates: ReadonlyArray<FieldTemplate<T>>,
): Partial<T> {
  const result: Partial<T> = {}
  const mutableResult = result as Record<string, unknown>

  for (const template of templates) {
    const value = template.extract(node)
    if (value === undefined) {
      continue
    }

    mutableResult[String(template.key)] = value
  }

  return result
}

function parseNode<T extends object>(node: FeedNode, template: NodeTemplate<T>): T {
  return {
    ...(template.defaults ?? {}),
    ...applyTemplate(node, template.fields),
  } as T
}

function createFeedTemplate(config: FeedTemplateConfig): NodeTemplate<ParsedFeed> {
  const fields: FieldTemplate<ParsedFeed>[] = [
    textField<ParsedFeed>('title', config.titlePaths),
    {
      key: 'link',
      extract: (node) => primaryLinkFromPaths(node, config.linkPaths),
    },
    {
      key: 'links',
      extract: (node) => linksFromPaths(node, config.linkPaths),
    },
  ]

  if (config.idPaths && config.idPaths.length > 0) {
    fields.push(textField<ParsedFeed>('id', config.idPaths))
  }

  if (config.descriptionPaths && config.descriptionPaths.length > 0) {
    fields.push(textField<ParsedFeed>('description', config.descriptionPaths))
  }

  if (config.languagePaths && config.languagePaths.length > 0) {
    fields.push(textField<ParsedFeed>('language', config.languagePaths))
  }

  if (config.copyrightPaths && config.copyrightPaths.length > 0) {
    fields.push(textField<ParsedFeed>('copyright', config.copyrightPaths))
  }

  if (config.generatorPaths && config.generatorPaths.length > 0) {
    fields.push(textField<ParsedFeed>('generator', config.generatorPaths))
  }

  if (config.publishedPaths && config.publishedPaths.length > 0) {
    fields.push(textField<ParsedFeed>('published', config.publishedPaths))
  }

  if (config.updatedPaths && config.updatedPaths.length > 0) {
    fields.push(textField<ParsedFeed>('updated', config.updatedPaths))
  }

  if (config.ttlPaths && config.ttlPaths.length > 0) {
    fields.push(textField<ParsedFeed>('ttl', config.ttlPaths))
  }

  if (config.imagePaths && config.imagePaths.length > 0) {
    fields.push({
      key: 'image',
      extract: (node) => imageFromPaths(node, config.imagePaths ?? []),
    })
  }

  return {
    defaults: {
      link: '',
      title: 'Untitled Feed',
    },
    fields,
  }
}

function createItemTemplate(config: ItemTemplateConfig): NodeTemplate<FeedItem> {
  const fields: FieldTemplate<FeedItem>[] = [
    textField<FeedItem>('title', config.titlePaths),
    {
      key: 'link',
      extract: (node) => primaryLinkFromPaths(node, config.linkPaths),
    },
    {
      key: 'links',
      extract: (node) => linksFromPaths(node, config.linkPaths),
    },
    {
      key: 'media',
      extract: (node) => mediaFromNode(node),
    },
  ]

  if (config.idPaths && config.idPaths.length > 0) {
    fields.push(textField<FeedItem>('id', config.idPaths))
  }

  if (config.publishedPaths && config.publishedPaths.length > 0) {
    fields.push(textField<FeedItem>('published', config.publishedPaths))
  }

  if (config.updatedPaths && config.updatedPaths.length > 0) {
    fields.push(textField<FeedItem>('updated', config.updatedPaths))
  }

  if (config.summaryPaths && config.summaryPaths.length > 0) {
    fields.push(textField<FeedItem>('summary', config.summaryPaths))
  }

  if (config.authorPaths && config.authorPaths.length > 0) {
    fields.push({
      key: 'author',
      extract: (node) => authorFromPaths(node, config.authorPaths ?? []),
    })
  }

  if (config.categoryPaths && config.categoryPaths.length > 0) {
    fields.push({
      key: 'categories',
      extract: (node) => categoriesFromPaths(node, config.categoryPaths ?? []),
    })
  }

  return {
    defaults: {
      title: 'Untitled Article',
    },
    fields,
  }
}

function parseWithTemplate(
  document: FeedNode,
  rootPath: string,
  itemPath: string,
  feedTemplate: NodeTemplate<ParsedFeed>,
  itemTemplate: NodeTemplate<FeedItem>,
): ParsedFeed {
  const root = asRecord(getPath(document, rootPath))
  if (!root) {
    throw new Error('Invalid feed format.')
  }

  const items = ensureArray(getPath(root, itemPath) as unknown | unknown[] | undefined).map(
    (entry) => parseNode(asRecord(entry) ?? {}, itemTemplate),
  )

  return {
    ...parseNode(root, feedTemplate),
    items,
  }
}

const rssItemTemplate = createItemTemplate({
  authorPaths: ['dc:creator', 'author'],
  categoryPaths: ['category'],
  idPaths: ['guid'],
  linkPaths: ['link', 'atom:link'],
  publishedPaths: ['pubDate', 'date', 'published'],
  summaryPaths: [
    'description',
    'content:encoded',
    'content',
    'dc:description',
    'media:description',
  ],
  titlePaths: ['title'],
  updatedPaths: ['updated'],
})

const atomItemTemplate = createItemTemplate({
  authorPaths: ['author', 'dc:creator'],
  categoryPaths: ['category'],
  idPaths: ['id'],
  linkPaths: ['link'],
  publishedPaths: ['published'],
  summaryPaths: ['summary', 'content', 'subtitle', 'media:description'],
  titlePaths: ['title'],
  updatedPaths: ['updated'],
})

const rssFeedTemplate = createFeedTemplate({
  copyrightPaths: ['copyright'],
  descriptionPaths: ['description'],
  generatorPaths: ['generator'],
  imagePaths: ['image'],
  languagePaths: ['language'],
  linkPaths: ['link', 'atom:link'],
  publishedPaths: ['pubDate'],
  titlePaths: ['title'],
  ttlPaths: ['ttl'],
  updatedPaths: ['lastBuildDate'],
})

const atomFeedTemplate = createFeedTemplate({
  copyrightPaths: ['rights'],
  descriptionPaths: ['subtitle', 'tagline'],
  generatorPaths: ['generator'],
  idPaths: ['id'],
  imagePaths: ['icon', 'logo'],
  languagePaths: ['@_xml:lang', '@_lang'],
  linkPaths: ['link'],
  publishedPaths: ['published'],
  titlePaths: ['title'],
  updatedPaths: ['updated'],
})

function parseRss(document: FeedNode): ParsedFeed {
  return parseWithTemplate(document, 'rss.channel', 'item', rssFeedTemplate, rssItemTemplate)
}

function parseAtom(document: FeedNode): ParsedFeed {
  return parseWithTemplate(document, 'feed', 'entry', atomFeedTemplate, atomItemTemplate)
}

export function parseFeed(xml: string): ParsedFeed {
  const parser = new XMLParser({
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
    parseTagValue: true,
    processEntities: true,
    trimValues: true,
  })

  const parsed = parser.parse(xml) as FeedNode

  if (parsed.rss) {
    return parseRss(parsed)
  }

  if (parsed.feed) {
    return parseAtom(parsed)
  }

  throw new Error('Unsupported feed format. Expected RSS or Atom.')
}
