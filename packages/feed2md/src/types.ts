export type MarkdownTemplatePreset = 'full' | 'short'

export interface Feed2MdOptions {
  fetchImpl?: typeof fetch
  includeSummary?: boolean
  limit?: number
  summaryMaxLength?: number
  template?: string
  templatePreset?: MarkdownTemplatePreset
}

export interface MarkdownRenderOptions {
  includeSummary?: boolean
  limit?: number
  summaryMaxLength?: number
  template?: string
  templatePreset?: MarkdownTemplatePreset
}

export interface FeedLink {
  href: string
  rel?: string
  type?: string
}

export interface FeedCategory {
  domain?: string
  label?: string
  name: string
  scheme?: string
}

export interface FeedImage {
  link?: string
  title?: string
  url?: string
}

export interface FeedMedia {
  credit?: string
  description?: string
  height?: string
  medium?: string
  type?: string
  url?: string
  width?: string
}

export interface FeedItem {
  author?: string
  categories?: FeedCategory[]
  id?: string
  link?: string
  links?: FeedLink[]
  media?: FeedMedia[]
  published?: string
  summary?: string
  title: string
  updated?: string
}

export interface ParsedFeed {
  copyright?: string
  description?: string
  generator?: string
  id?: string
  image?: FeedImage
  items: FeedItem[]
  language?: string
  link: string
  links?: FeedLink[]
  published?: string
  title: string
  ttl?: string
  updated?: string
}
