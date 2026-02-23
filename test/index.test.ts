import { describe, expect, it } from 'vitest'

import { feed2md, parseFeed, toMarkdown } from '../src/index.js'
import { sampleAtom, sampleRss } from './fixtures.js'

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
