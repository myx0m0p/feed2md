export interface Feed2MdOptions {
  fetchImpl?: typeof fetch
  includeSummary?: boolean
  limit?: number
  summaryMaxLength?: number
}

export interface MarkdownRenderOptions {
  includeSummary?: boolean
  limit?: number
  summaryMaxLength?: number
}

export interface FeedItem {
  link?: string
  published?: string
  summary?: string
  title: string
}

export interface ParsedFeed {
  items: FeedItem[]
  link: string
  title: string
}
