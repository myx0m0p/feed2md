import { XMLParser } from 'fast-xml-parser'

import type { ParsedFeed } from './types.js'
import { ensureArray, firstText } from './utils.js'

function linkFromAtom(linkNode: unknown): string | undefined {
  const links = ensureArray(linkNode as Record<string, unknown> | undefined)

  for (const link of links) {
    if (!link || typeof link !== 'object') {
      continue
    }

    const candidate = link as Record<string, unknown>
    const href = candidate['@_href']
    const rel = candidate['@_rel']

    if (typeof href === 'string' && (rel === undefined || rel === 'alternate')) {
      return href
    }
  }

  return undefined
}

function parseRss(document: Record<string, unknown>): ParsedFeed {
  const rss = document.rss as Record<string, unknown>
  const channel = rss.channel as Record<string, unknown>

  const items = ensureArray(channel.item as Record<string, unknown> | undefined).map((item) => {
    const entry = item as Record<string, unknown>

    return {
      link: firstText(entry.link),
      published: firstText(entry.pubDate) ?? firstText(entry.date) ?? firstText(entry.published),
      summary:
        firstText(entry.description) ??
        firstText(entry['content:encoded']) ??
        firstText(entry.content) ??
        firstText(entry['dc:description']),
      title: firstText(entry.title) ?? 'Untitled Article',
    }
  })

  return {
    items,
    link: firstText(channel.link) ?? '',
    title: firstText(channel.title) ?? 'Untitled Feed',
  }
}

function parseAtom(document: Record<string, unknown>): ParsedFeed {
  const feed = document.feed as Record<string, unknown>

  const items = ensureArray(feed.entry as Record<string, unknown> | undefined).map((entry) => {
    const candidate = entry as Record<string, unknown>

    return {
      link: linkFromAtom(candidate.link),
      published: firstText(candidate.updated) ?? firstText(candidate.published),
      summary:
        firstText(candidate.summary) ??
        firstText(candidate.content) ??
        firstText(candidate.subtitle) ??
        firstText(candidate['media:description']),
      title: firstText(candidate.title) ?? 'Untitled Article',
    }
  })

  return {
    items,
    link: linkFromAtom(feed.link) ?? '',
    title: firstText(feed.title) ?? 'Untitled Feed',
  }
}

export function parseFeed(xml: string): ParsedFeed {
  const parser = new XMLParser({
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
    parseTagValue: true,
    processEntities: true,
    trimValues: true,
  })

  const parsed = parser.parse(xml) as Record<string, unknown>

  if (parsed.rss) {
    return parseRss(parsed)
  }

  if (parsed.feed) {
    return parseAtom(parsed)
  }

  throw new Error('Unsupported feed format. Expected RSS or Atom.')
}
