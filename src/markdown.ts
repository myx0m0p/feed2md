import type { FeedLink, FeedMedia, MarkdownRenderOptions, ParsedFeed } from './types.js'
import { collapseWhitespace, escapeMarkdown, sanitizePreview } from './utils.js'

const DEFAULT_SUMMARY_MAX_LENGTH = 280

function normalizeRenderOptions(
  limitOrOptions?: number | MarkdownRenderOptions,
): MarkdownRenderOptions {
  if (typeof limitOrOptions === 'number') {
    return { limit: limitOrOptions }
  }

  return limitOrOptions ?? {}
}

function renderLink(link: FeedLink): string {
  if (!link.rel && !link.type) {
    return link.href
  }

  const qualifiers = [link.rel, link.type].filter((entry): entry is string => Boolean(entry)).join(', ')
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

export function toMarkdown(
  feed: ParsedFeed,
  limitOrOptions?: number | MarkdownRenderOptions,
): string {
  const options = normalizeRenderOptions(limitOrOptions)
  const includeSummary = options.includeSummary ?? true
  const summaryMaxLength = options.summaryMaxLength ?? DEFAULT_SUMMARY_MAX_LENGTH

  const cappedItems =
    typeof options.limit === 'number' && options.limit > 0
      ? feed.items.slice(0, options.limit)
      : feed.items

  const lines: string[] = [`# ${escapeMarkdown(feed.title)}`, '']

  if (feed.link) {
    lines.push(`Source: ${feed.link}`, '')
  }

  if (feed.description) {
    lines.push(`Description: ${escapeMarkdown(collapseWhitespace(feed.description))}`)
  }

  if (feed.language) {
    lines.push(`Language: ${escapeMarkdown(collapseWhitespace(feed.language))}`)
  }

  if (feed.published) {
    lines.push(`Published: ${escapeMarkdown(collapseWhitespace(feed.published))}`)
  }

  if (feed.updated) {
    lines.push(`Updated: ${escapeMarkdown(collapseWhitespace(feed.updated))}`)
  }

  if (feed.generator) {
    lines.push(`Generator: ${escapeMarkdown(collapseWhitespace(feed.generator))}`)
  }

  if (feed.copyright) {
    lines.push(`Copyright: ${escapeMarkdown(collapseWhitespace(feed.copyright))}`)
  }

  if (feed.ttl) {
    lines.push(`TTL: ${escapeMarkdown(collapseWhitespace(feed.ttl))}`)
  }

  if (feed.id) {
    lines.push(`ID: ${escapeMarkdown(collapseWhitespace(feed.id))}`)
  }

  if (feed.image?.url) {
    lines.push(`Image: ${feed.image.url}`)
  }

  const extraFeedLinks = (feed.links ?? []).filter((link) => link.href !== feed.link)
  if (extraFeedLinks.length > 0) {
    lines.push(`Links: ${extraFeedLinks.map((link) => renderLink(link)).join(', ')}`)
  }

  if (lines[lines.length - 1] !== '') {
    lines.push('')
  }

  if (cappedItems.length === 0) {
    lines.push('_No articles found._')
    return lines.join('\n')
  }

  lines.push('## Articles', '')

  for (const item of cappedItems) {
    const title = escapeMarkdown(item.title)
    const link = item.link ? `(${item.link})` : ''
    lines.push(`- ${title}${link ? ` - ${link}` : ''}`)

    if (item.published) {
      lines.push(`  - Published: ${escapeMarkdown(collapseWhitespace(item.published))}`)
    }

    if (item.updated) {
      lines.push(`  - Updated: ${escapeMarkdown(collapseWhitespace(item.updated))}`)
    }

    if (item.id) {
      lines.push(`  - ID: ${escapeMarkdown(collapseWhitespace(item.id))}`)
    }

    if (item.author) {
      lines.push(`  - Author: ${escapeMarkdown(collapseWhitespace(item.author))}`)
    }

    if (item.categories && item.categories.length > 0) {
      const categories = item.categories.map((category) => category.name).join(', ')
      lines.push(`  - Categories: ${escapeMarkdown(collapseWhitespace(categories))}`)
    }

    const extraItemLinks = (item.links ?? []).filter((link) => link.href !== item.link)
    if (extraItemLinks.length > 0) {
      lines.push(`  - Links: ${extraItemLinks.map((link) => renderLink(link)).join(', ')}`)
    }

    if (item.media && item.media.length > 0) {
      for (const mediaItem of item.media) {
        const renderedMedia = renderMedia(mediaItem)
        if (renderedMedia) {
          lines.push(`  - Media: ${escapeMarkdown(renderedMedia)}`)
        }
      }
    }

    if (includeSummary && item.summary) {
      const preview = sanitizePreview(item.summary, summaryMaxLength)
      if (preview) {
        lines.push(`  - Summary: ${escapeMarkdown(preview)}`)
      }
    }
  }

  return lines.join('\n')
}
