# feed2md

[![npm version](https://img.shields.io/npm/v/%40myx0m0p%2Ffeed2md)](https://www.npmjs.com/package/@myx0m0p/feed2md)
[![CI](https://github.com/myx0m0p/feed2md/actions/workflows/ci.yml/badge.svg)](https://github.com/myx0m0p/feed2md/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js >=24](https://img.shields.io/badge/node-%3E%3D24-339933)](https://nodejs.org)

`feed2md` converts RSS and Atom feeds into clean Markdown.

It ships as:

- a TypeScript library
- a CLI tool for terminal workflows

## Why this project

- Quickly archive feed updates as Markdown
- Generate changelog-like digests from feeds
- Reuse the parser + markdown renderer in your own tooling

## Installation

```bash
pnpm add @myx0m0p/feed2md
```

## CLI usage

```bash
pnpm dlx @myx0m0p/feed2md <feed-url> [options]
```

Options:

- `-o, --output <file>`: write output to file
- `--limit <number>`: limit article count
- `--no-summary`: skip preview text
- `--summary-max-length <number>`: truncate summary preview

Examples:

```bash
# print to stdout
pnpm dlx @myx0m0p/feed2md https://example.com/feed.xml

# write to a file
pnpm dlx @myx0m0p/feed2md https://example.com/feed.xml --output feed.md

# limit items and shorten previews
pnpm dlx @myx0m0p/feed2md https://example.com/feed.xml --limit 5 --summary-max-length 140
```

## Library usage

```ts
import { feed2md } from '@myx0m0p/feed2md'

const markdown = await feed2md('https://example.com/feed.xml', {
  limit: 10,
  includeSummary: true,
  summaryMaxLength: 220,
})

console.log(markdown)
```

## API

### `feed2md(url, options?)`

Fetches a feed and returns Markdown.

Options (`Feed2MdOptions`):

- `fetchImpl?: typeof fetch`
- `includeSummary?: boolean` (default: `true`)
- `limit?: number`
- `summaryMaxLength?: number` (default: `280`)

### `parseFeed(xml)`

Parses RSS/Atom XML into a normalized `ParsedFeed` object.

### `toMarkdown(feed, options?)`

Renders normalized feed data to Markdown.

Supports:

- `toMarkdown(feed, 5)` (legacy numeric limit)
- `toMarkdown(feed, { limit, includeSummary, summaryMaxLength })`

## Does RSS/Atom include article preview text?

Often yes, but it depends on the feed publisher.

Common fields used by `feed2md`:

- RSS: `description`, `content:encoded`, `content`, `dc:description`
- Atom: `summary`, `content`, `subtitle`, `media:description`

If no summary-like field exists, output includes title/link/published date only.

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

Useful scripts:

- `pnpm format`
- `pnpm format:check`
- `pnpm test:watch`

## Contributing

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Project roadmap/plan: [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)

## License

MIT. See [LICENSE](LICENSE).
