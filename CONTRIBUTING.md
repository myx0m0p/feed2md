# Contributing to feed2md

Thanks for contributing.

## Prerequisites

- Node.js 24+
- pnpm 10+

## Setup

```bash
git clone https://github.com/myx0m0p/feed2md.git
cd feed2md
pnpm install
```

## Workflow

1. Create a branch from `main`.
2. Keep changes focused and reviewable.
3. Add or update tests.
4. Run quality checks locally.
5. Open a pull request using the template.

## Quality checks

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

## Code standards

- TypeScript with strict type checks
- Prefer small composable modules over large files
- Keep CLI/library behavior backward-compatible where reasonable
- Add comments only where intent is non-obvious

## Pull requests

- Explain what changed and why
- Link related issue(s)
- Include tests for behavior changes
- Call out any breaking changes explicitly

## Reporting issues

Use the issue templates and include:

- expected behavior
- actual behavior
- minimal reproduction
- environment details (`node -v`, `pnpm -v`, OS)
