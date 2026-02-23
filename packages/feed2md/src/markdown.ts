import { Eta } from 'eta'

import type {
  FeedLink,
  FeedMedia,
  MarkdownRenderOptions,
  MarkdownTemplatePreset,
  ParsedFeed,
} from './types.js'
import { collapseWhitespace, escapeMarkdown, sanitizePreview } from './utils.js'

const DEFAULT_SUMMARY_MAX_LENGTH = 280
const DEFAULT_TEMPLATE_PRESET: MarkdownTemplatePreset = 'short'

const SHORT_TEMPLATE = `# <%= it.feed.title %>

<% if (it.feed.source) { %>Source: <%= it.feed.source %>

<% } %><% if (it.items.length === 0) { %>_No articles found._
<% } else { %>## Articles

<% it.items.forEach((item) => { %>- <%= item.header %>
<% item.shortLines.forEach((line) => { %>  - <%= line %>
<% }) %><% }) %><% } %>`

const FULL_TEMPLATE = `# <%= it.feed.title %>

<% if (it.feed.source) { %>Source: <%= it.feed.source %>

<% } %><% it.feed.fullLines.forEach((line) => { %><%= line %>
<% }) %><% if (it.feed.fullLines.length > 0) { %>
<% } %><% if (it.items.length === 0) { %>_No articles found._
<% } else { %>## Articles

<% it.items.forEach((item) => { %>- <%= item.header %>
<% item.fullLines.forEach((line) => { %>  - <%= line %>
<% }) %><% }) %><% } %>`

const BUILTIN_TEMPLATES: Record<MarkdownTemplatePreset, string> = {
  full: FULL_TEMPLATE,
  short: SHORT_TEMPLATE,
}

const templateEngine = new Eta({
  autoEscape: false,
  autoTrim: false,
})

interface MarkdownTemplateData {
  feed: {
    fullLines: string[]
    source?: string
    title: string
  }
  includeSummary: boolean
  items: Array<{
    fullLines: string[]
    header: string
    shortLines: string[]
  }>
  preset: MarkdownTemplatePreset
  raw: ParsedFeed
}

function normalizeRenderOptions(
  limitOrOptions?: number | MarkdownRenderOptions,
): MarkdownRenderOptions {
  if (typeof limitOrOptions === 'number') {
    return { limit: limitOrOptions }
  }

  return limitOrOptions ?? {}
}

function cleanTemplateOutput(output: string): string {
  return output
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
}

function normalizeText(value: string): string {
  return escapeMarkdown(collapseWhitespace(value))
}

function renderLink(link: FeedLink): string {
  if (!link.rel && !link.type) {
    return link.href
  }

  const qualifiers = [link.rel, link.type]
    .filter((entry): entry is string => Boolean(entry))
    .join(', ')
  return `${qualifiers}: ${link.href}`
}

function renderMedia(media: FeedMedia): string {
  const dimensions = media.width && media.height ? `${media.width}x${media.height}` : undefined
  const descriptors = [media.medium, media.type, dimensions]
    .filter((entry): entry is string => Boolean(entry))
    .join(', ')

  const parts: string[] = []
  if (media.url) {
    parts.push(media.url)
  }

  if (descriptors) {
    parts.push(descriptors)
  }

  if (media.credit) {
    parts.push(`credit: ${collapseWhitespace(media.credit)}`)
  }

  if (media.description) {
    parts.push(`description: ${collapseWhitespace(media.description)}`)
  }

  return parts.join(' | ')
}

function createTemplateData(
  feed: ParsedFeed,
  options: MarkdownRenderOptions,
): MarkdownTemplateData {
  const includeSummary = options.includeSummary ?? true
  const summaryMaxLength = options.summaryMaxLength ?? DEFAULT_SUMMARY_MAX_LENGTH
  const preset = options.templatePreset ?? DEFAULT_TEMPLATE_PRESET
  const cappedItems =
    typeof options.limit === 'number' && options.limit > 0
      ? feed.items.slice(0, options.limit)
      : feed.items

  const fullFeedLines: string[] = []
  if (feed.description) {
    fullFeedLines.push(`Description: ${normalizeText(feed.description)}`)
  }
  if (feed.language) {
    fullFeedLines.push(`Language: ${normalizeText(feed.language)}`)
  }
  if (feed.published) {
    fullFeedLines.push(`Published: ${normalizeText(feed.published)}`)
  }
  if (feed.updated) {
    fullFeedLines.push(`Updated: ${normalizeText(feed.updated)}`)
  }
  if (feed.generator) {
    fullFeedLines.push(`Generator: ${normalizeText(feed.generator)}`)
  }
  if (feed.copyright) {
    fullFeedLines.push(`Copyright: ${normalizeText(feed.copyright)}`)
  }
  if (feed.ttl) {
    fullFeedLines.push(`TTL: ${normalizeText(feed.ttl)}`)
  }
  if (feed.id) {
    fullFeedLines.push(`ID: ${normalizeText(feed.id)}`)
  }
  if (feed.image?.url) {
    fullFeedLines.push(`Image: ${feed.image.url}`)
  }

  const extraFeedLinks = (feed.links ?? []).filter((link) => link.href !== feed.link)
  if (extraFeedLinks.length > 0) {
    fullFeedLines.push(`Links: ${extraFeedLinks.map((link) => renderLink(link)).join(', ')}`)
  }

  const items = cappedItems.map((item) => {
    const shortLines: string[] = []
    const fullLines: string[] = []

    if (item.published) {
      const value = `Published: ${normalizeText(item.published)}`
      shortLines.push(value)
      fullLines.push(value)
    }

    if (item.updated) {
      fullLines.push(`Updated: ${normalizeText(item.updated)}`)
    }

    if (item.id) {
      fullLines.push(`ID: ${normalizeText(item.id)}`)
    }

    if (item.author) {
      fullLines.push(`Author: ${normalizeText(item.author)}`)
    }

    if (item.categories && item.categories.length > 0) {
      const categories = item.categories.map((category) => category.name).join(', ')
      fullLines.push(`Categories: ${normalizeText(categories)}`)
    }

    const extraItemLinks = (item.links ?? []).filter((link) => link.href !== item.link)
    if (extraItemLinks.length > 0) {
      fullLines.push(`Links: ${extraItemLinks.map((link) => renderLink(link)).join(', ')}`)
    }

    if (item.media && item.media.length > 0) {
      for (const mediaItem of item.media) {
        const renderedMedia = renderMedia(mediaItem)
        if (renderedMedia) {
          fullLines.push(`Media: ${escapeMarkdown(renderedMedia)}`)
        }
      }
    }

    if (includeSummary && item.summary) {
      const preview = sanitizePreview(item.summary, summaryMaxLength)
      if (preview) {
        const summaryLine = `Summary: ${escapeMarkdown(preview)}`
        shortLines.push(summaryLine)
        fullLines.push(summaryLine)
      }
    }

    const title = escapeMarkdown(item.title)
    const header = item.link ? `${title} - (${item.link})` : title

    return {
      fullLines,
      header,
      shortLines,
    }
  })

  return {
    feed: {
      fullLines: fullFeedLines,
      ...(feed.link ? { source: feed.link } : {}),
      title: escapeMarkdown(feed.title),
    },
    includeSummary,
    items,
    preset,
    raw: feed,
  }
}

function resolveTemplate(options: MarkdownRenderOptions): string {
  if (options.template) {
    return options.template
  }

  const preset = options.templatePreset ?? DEFAULT_TEMPLATE_PRESET
  return BUILTIN_TEMPLATES[preset]
}

export function toMarkdown(
  feed: ParsedFeed,
  limitOrOptions?: number | MarkdownRenderOptions,
): string {
  const options = normalizeRenderOptions(limitOrOptions)
  const data = createTemplateData(feed, options)
  const template = resolveTemplate(options)
  const rendered = templateEngine.renderString(template, data)

  if (typeof rendered !== 'string') {
    throw new Error('Failed to render markdown template.')
  }

  return cleanTemplateOutput(rendered)
}
