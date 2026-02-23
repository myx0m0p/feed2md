export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_{}[\]()#+\-.!|>]/g, '\\$&')
}

export function firstText(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const text = value.trim()
    return text.length > 0 ? text : undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'object') {
    const candidate = value as Record<string, unknown>
    if (typeof candidate['#text'] === 'string') {
      const text = candidate['#text'].trim()
      return text.length > 0 ? text : undefined
    }

    if (typeof candidate['__cdata'] === 'string') {
      const text = candidate['__cdata'].trim()
      return text.length > 0 ? text : undefined
    }
  }

  return undefined
}

export function sanitizePreview(raw: string, maxLength: number): string {
  const withoutHtml = raw.replace(/<[^>]+>/g, ' ')
  const collapsed = collapseWhitespace(withoutHtml)

  if (collapsed.length <= maxLength) {
    return collapsed
  }

  const sliced = collapsed.slice(0, maxLength).trimEnd()
  return `${sliced}...`
}
