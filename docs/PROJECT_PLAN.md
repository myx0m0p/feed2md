# feed2md Project Plan

This roadmap merges the initial project improvement plan with the latest requirements.

## Phase 1: Foundation and docs (now)

- [x] Rewrite README with better structure and badges
- [x] Switch project defaults to pnpm
- [x] Align versioning to `0.0.1`
- [x] Add `packageManager`, repository metadata, publish config
- [x] Introduce formatting stack with Prettier + import sorting plugin
- [x] Add CI workflow and community templates

## Phase 2: Core architecture refactor (now)

- [x] Split monolithic `src/index.ts` into modular units:
  - parser
  - markdown renderer
  - client/fetch orchestration
  - shared types + utilities
- [x] Move tests from `src/` to `test/`
- [x] Remove unnecessary date dependency (`date-fns`)

## Phase 3: Feed quality improvements (now)

- [x] Ensure article preview extraction from common RSS/Atom summary fields
- [x] Add options to control summary inclusion and preview length
- [x] Improve URL validation and error handling

## Phase 4: Community and contribution quality (now)

- [x] Add issue templates (bug + feature)
- [x] Add pull request template
- [x] Add `CODE_OF_CONDUCT.md`
- [x] Add `SECURITY.md`

## Phase 5: Next improvements (backlog)

- [ ] Add JSON output mode (`--format json`)
- [ ] Add filtering options (`--since`, keyword include/exclude)
- [ ] Add deterministic sorting and optional deduplication
- [ ] Add support for reading from local XML files or stdin
- [ ] Add configuration file support (`feed2md.config.*`)
- [ ] Add integration tests against real public feeds with network mocking
