import { toMarkdown } from './markdown.js'
import { parseFeed } from './parser.js'
import type { Feed2MdOptions } from './types.js'

export async function feed2md(url: string, options: Feed2MdOptions = {}): Promise<string> {
  const { fetchImpl = fetch } = options

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }

  const response = await fetchImpl(parsedUrl.toString())

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  const parsedFeed = parseFeed(xml)

  return toMarkdown(parsedFeed, {
    includeSummary: options.includeSummary,
    limit: options.limit,
    summaryMaxLength: options.summaryMaxLength,
  })
}
