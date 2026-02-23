# @myx0m0p/feed2md

Library package for converting RSS and Atom feeds to Markdown.

## Install

```bash
pnpm add @myx0m0p/feed2md
```

## Usage

```ts
import { feed2md } from '@myx0m0p/feed2md'

const markdown = await feed2md('https://example.com/feed.xml')
console.log(markdown)
```

For full docs and CLI usage, see the repository README.
