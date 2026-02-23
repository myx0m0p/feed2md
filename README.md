# feed2md

[![npm version](https://img.shields.io/npm/v/feed2md)](https://www.npmjs.com/package/feed2md)
[![CI](https://github.com/myx0m0p/feed2md/actions/workflows/ci.yml/badge.svg)](https://github.com/myx0m0p/feed2md/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js >=24](https://img.shields.io/badge/node-%3E%3D24-339933)](https://nodejs.org)

`feed2md` converts RSS and Atom feeds into clean Markdown.

It ships as:

- a library package: `feed2md`
- a CLI package: `feed2md-cli`

## Why this project

- Quickly archive feed updates as Markdown
- Generate changelog-like digests from feeds
- Reuse the parser + markdown renderer in your own tooling

## Installation

<details open>
<summary><strong>Library (npm)</strong></summary>

```bash
npm install feed2md
```

</details>

<details>
<summary><strong>Library (pnpm)</strong></summary>

```bash
pnpm add feed2md
```

</details>

<details>
<summary><strong>CLI (npm)</strong></summary>

```bash
npx feed2md-cli <feed-url> [options]
```

</details>

<details>
<summary><strong>CLI (pnpm)</strong></summary>

```bash
pnpm dlx feed2md-cli <feed-url> [options]
```

</details>

## CLI usage

<details open>
<summary><strong>npm (npx)</strong></summary>

```bash
npx feed2md-cli <feed-url> [options]
```

</details>

<details>
<summary><strong>pnpm</strong></summary>

```bash
pnpm dlx feed2md-cli <feed-url> [options]
```

</details>

Options:

- `-o, --output <file>`: write output to file
- `--limit <number>`: limit article count
- `--no-summary`: skip preview text
- `--summary-max-length <number>`: truncate summary preview
- `--template <preset>`: built-in template preset (`short` or `full`, default: `short`)
- `--template-file <path>`: load a custom [Eta](https://eta.js.org/) template file

Examples:

```bash
# print to stdout
npx feed2md-cli https://example.com/feed.xml

# write to a file
npx feed2md-cli https://example.com/feed.xml --output feed.md

# limit items and shorten previews
npx feed2md-cli https://example.com/feed.xml --limit 5 --summary-max-length 140

# render with full metadata template
npx feed2md-cli https://example.com/feed.xml --template full

# render with a custom Eta template file
npx feed2md-cli https://example.com/feed.xml --template-file ./templates/feed.eta
```

## Library usage

```ts
import { feed2md } from 'feed2md'

const markdown = await feed2md('https://example.com/feed.xml', {
  limit: 10,
  includeSummary: true,
  summaryMaxLength: 220,
  templatePreset: 'short', // default
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
- `templatePreset?: 'short' | 'full'` (default: `'short'`)
- `template?: string` (custom Eta template content; overrides `templatePreset`)

### `parseFeed(xml)`

Parses RSS/Atom XML into a normalized `ParsedFeed` object.

Normalized data now includes feed/item metadata such as:

- links (`link` + `links[]` with rel/type)
- ids (`guid`/`id`)
- authors (`dc:creator` / Atom `author`)
- categories (RSS `category`, Atom `category term`)
- media payloads (`media:content`, `media:group`, `media:credit`, `media:description`)
- feed-level metadata (`description`, `language`, `copyright`, `generator`, `ttl`, `image`)

### `toMarkdown(feed, options?)`

Renders normalized feed data to Markdown.

Supports:

- `toMarkdown(feed, 5)` (legacy numeric limit)
- `toMarkdown(feed, { limit, includeSummary, summaryMaxLength, templatePreset, template })`

Built-in templates:

- `short` (default): compact output for title/link/date/summary
- `full`: includes all normalized feed/item metadata

Custom templates use Eta syntax and receive context as `it`:

- `it.feed`: rendered feed view (`title`, `source`, `fullLines`)
- `it.items`: rendered item views (`header`, `shortLines`, `fullLines`)
- `it.raw`: raw normalized `ParsedFeed`
- `it.includeSummary`: effective summary toggle
- `it.preset`: selected preset (`short` or `full`)

## Input/Output Samples

See [`docs/SAMPLES.md`](docs/SAMPLES.md) for concrete XML input and rendered markdown output examples.

## Does RSS/Atom include article preview text?

Often yes, but it depends on the feed publisher.

Common fields used by `feed2md`:

- RSS: `description`, `content:encoded`, `content`, `dc:description`, `dc:creator`, `category`, `guid`, `media:*`
- Atom: `summary`, `content`, `subtitle`, `author`, `category`, `id`, `link`, `updated`, `published`

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
- `pnpm changeset`
- `pnpm test:watch`

## Release

This repo uses [Changesets](https://github.com/changesets/changesets) + GitHub Actions.

1. Add a changeset in feature/fix PRs:

   ```bash
   pnpm changeset
   ```

2. Merge to `main`. The `Release` workflow will open/update a version PR.
3. Merge the version PR to publish to npm.

## Contributing

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Project roadmap/plan: [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)

## License

MIT. See [LICENSE](LICENSE).
