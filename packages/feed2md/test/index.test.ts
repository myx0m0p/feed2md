import { describe, expect, it } from 'vitest'

import { feed2md, parseFeed, toMarkdown } from '../src/index.js'
import {
  cnnTopStoriesRss,
  nytTechnologyRss,
  richAtomFeed,
  sampleAtom,
  sampleRss,
} from './fixtures.js'

describe('parseFeed', () => {
  it('parses RSS feeds', () => {
    const parsed = parseFeed(sampleRss)
    expect(parsed.title).toBe('Example RSS Feed')
    expect(parsed.items).toHaveLength(2)
  })

  it('parses Atom feeds', () => {
    const parsed = parseFeed(sampleAtom)
    expect(parsed.title).toBe('Example Atom Feed')
    expect(parsed.items).toHaveLength(2)
  })

  it('extracts article previews from RSS content fields', () => {
    const parsed = parseFeed(sampleRss)
    expect(parsed.items[1]?.summary).toContain('content:encoded')
  })

  it('extracts NYT RSS feed metadata and item fields', () => {
    const parsed = parseFeed(nytTechnologyRss)
    const item = parsed.items[0]

    expect(parsed.title).toBe('NYT > Technology')
    expect(parsed.description).toBe('New York Times technology coverage.')
    expect(parsed.language).toBe('en-us')
    expect(parsed.updated).toBe('Mon, 23 Feb 2026 06:26:58 +0000')
    expect(parsed.links?.[0]).toEqual({
      href: 'https://www.nytimes.com/section/technology',
    })
    expect(parsed.links?.[1]).toEqual({
      href: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
      rel: 'self',
      type: 'application/rss+xml',
    })
    expect(parsed.image?.url).toBe('https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png')
    expect(item?.id).toBe('https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html')
    expect(item?.author).toBe('David Streitfeld')
    expect(item?.categories?.map((category) => category.name)).toEqual([
      'Artificial Intelligence',
      'Computers and the Internet',
    ])
    expect(item?.media?.[0]).toMatchObject({
      credit: 'Associated Press',
      description:
        'Sam Altman recently said artificial intelligence was spreading more slowly than expected.',
      medium: 'image',
    })
  })

  it('extracts CNN RSS media groups and channel metadata', () => {
    const parsed = parseFeed(cnnTopStoriesRss)
    const item = parsed.items[0]

    expect(parsed.generator).toBe('coredev-bumblebee')
    expect(parsed.ttl).toBe('10')
    expect(parsed.updated).toBe('Thu, 22 Aug 2024 15:19:24 GMT')
    expect(item?.media).toHaveLength(2)
    expect(item?.media?.[0]).toMatchObject({
      medium: 'image',
      type: 'image/jpeg',
      url: 'https://cdn.cnn.com/cnnnext/dam/assets/230418164538-02-dominion-fox-trial-settlement-0418-super-169.jpg',
    })
  })

  it('extracts Atom-specific feed and entry fields', () => {
    const parsed = parseFeed(richAtomFeed)
    const item = parsed.items[0]

    expect(parsed.id).toBe('https://www.theverge.com/rss/index.xml')
    expect(parsed.language).toBe('en')
    expect(parsed.description).toBe('The Verge feed subtitle')
    expect(parsed.image?.url).toBe('https://cdn.vox-cdn.com/thumbor/verge-icon.png')
    expect(parsed.links?.[1]).toEqual({
      href: 'https://www.theverge.com/rss/index.xml',
      rel: 'self',
      type: 'application/atom+xml',
    })
    expect(item?.author).toBe('The Verge Staff')
    expect(item?.id).toBe('tag:www.theverge.com,2026:/sample-story')
    expect(item?.categories?.[0]).toEqual({
      name: 'Technology',
      scheme: 'https://www.theverge.com/rss/index.xml',
    })
  })
})

describe('toMarkdown', () => {
  it('renders feed metadata and articles', () => {
    const parsed = parseFeed(sampleRss)
    const markdown = toMarkdown(parsed)

    expect(markdown).toContain('# Example RSS Feed')
    expect(markdown).toContain('Source: https://example.com')
    expect(markdown).toContain('## Articles')
    expect(markdown).toContain('- Article 1 - (https://example.com/article-1)')
    expect(markdown).toContain('Summary: Second article preview from content:encoded\\.')
  })

  it('renders extended fields from parsed feeds', () => {
    const parsed = parseFeed(nytTechnologyRss)
    const markdown = toMarkdown(parsed, { templatePreset: 'full' })

    expect(markdown).toContain('Description: New York Times technology coverage\\.')
    expect(markdown).toContain('Language: en\\-us')
    expect(markdown).toContain('Updated: Mon, 23 Feb 2026 06:26:58 \\+0000')
    expect(markdown).toContain(
      'ID: https://www\\.nytimes\\.com/2026/02/21/technology/ai\\-boom\\-backlash\\.html',
    )
    expect(markdown).toContain('Author: David Streitfeld')
    expect(markdown).toContain('Categories: Artificial Intelligence, Computers and the Internet')
    expect(markdown).toContain(
      'Media: https://static01\\.nyt\\.com/images/2026/02/22/multimedia/21biz\\-ai\\-backlash\\-altman\\-ckvl/21biz\\-ai\\-backlash\\-altman\\-ckvl\\-mediumSquareAt3X\\.jpg',
    )
  })

  it('uses short template by default', () => {
    const parsed = parseFeed(nytTechnologyRss)
    const markdown = toMarkdown(parsed)

    expect(markdown).not.toContain('Description:')
    expect(markdown).not.toContain('Author:')
    expect(markdown).toContain('Summary:')
  })

  it('supports custom template strings', () => {
    const parsed = parseFeed(sampleRss)
    const markdown = toMarkdown(parsed, {
      template: `Feed=<%= it.feed.title %>\nCount=<%= it.items.length %>\nFirst=<%= it.items[0].header %>`,
    })

    expect(markdown).toContain('Feed=Example RSS Feed')
    expect(markdown).toContain('Count=2')
    expect(markdown).toContain('First=Article 1 - (https://example.com/article-1)')
  })

  it('respects item limit', () => {
    const parsed = parseFeed(sampleRss)
    const markdown = toMarkdown(parsed, { limit: 1 })

    expect(markdown).toContain('Article 1')
    expect(markdown).not.toContain('Article 2')
  })

  it('supports disabling summary output', () => {
    const parsed = parseFeed(sampleRss)
    const markdown = toMarkdown(parsed, { includeSummary: false })

    expect(markdown).not.toContain('Summary:')
  })

  it('limits summary length', () => {
    const parsed = parseFeed(sampleRss)
    const markdown = toMarkdown(parsed, { summaryMaxLength: 10 })

    expect(markdown).toContain('Summary: Second art\\.\\.\\.')
  })
})

describe('feed2md', () => {
  it('fetches and converts feed to markdown', async () => {
    const markdown = await feed2md('https://example.com/feed.xml', {
      fetchImpl: async () =>
        new Response(sampleRss, {
          headers: { 'Content-Type': 'application/rss+xml' },
          status: 200,
        }),
    })

    expect(markdown).toContain('# Example RSS Feed')
    expect(markdown).toContain('Article 1')
  })

  it('supports template preset through feed2md options', async () => {
    const markdown = await feed2md('https://example.com/feed.xml', {
      fetchImpl: async () =>
        new Response(nytTechnologyRss, {
          headers: { 'Content-Type': 'application/rss+xml' },
          status: 200,
        }),
      templatePreset: 'full',
    })

    expect(markdown).toContain('Description: New York Times technology coverage\\.')
    expect(markdown).toContain('Author: David Streitfeld')
  })

  it('supports custom templates through feed2md options', async () => {
    const markdown = await feed2md('https://example.com/feed.xml', {
      fetchImpl: async () =>
        new Response(sampleRss, {
          headers: { 'Content-Type': 'application/rss+xml' },
          status: 200,
        }),
      template: 'Items=<%= it.items.length %>',
    })

    expect(markdown).toBe('Items=2')
  })

  it('throws on invalid URL', async () => {
    await expect(feed2md('not-a-url')).rejects.toThrow('Invalid URL: not-a-url')
  })

  it('throws on fetch failure', async () => {
    await expect(
      feed2md('https://example.com/bad.xml', {
        fetchImpl: async () =>
          new Response('not found', {
            status: 404,
            statusText: 'Not Found',
          }),
      }),
    ).rejects.toThrow('Failed to fetch feed: 404 Not Found')
  })
})
