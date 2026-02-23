import type { MarkdownRenderOptions, ParsedFeed } from './types.js'
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

    if (includeSummary && item.summary) {
      const preview = sanitizePreview(item.summary, summaryMaxLength)
      if (preview) {
        lines.push(`  - Summary: ${escapeMarkdown(preview)}`)
      }
    }
  }

  return lines.join('\n')
}
