---
'@myx0m0p/feed2md': major
'@myx0m0p/feed2md-cli': minor
---

Split the CLI into a separate `@myx0m0p/feed2md-cli` package so the library package no longer depends on `commander`.

The `@myx0m0p/feed2md` package is now library-only and no longer ships the `feed2md` binary.
