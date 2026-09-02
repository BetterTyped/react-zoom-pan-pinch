# #529 — Source maps reference missing src/ folder in npm package

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/529
- **Reported by:** @zaycker
- **Created:** 2025-03-04
- **Reported-against version:** _unverified_
- **Deduped issues:** #542
- **Area:** build

## Summary

The published npm package includes source maps that reference TypeScript files under `src/`, but the `src/` folder is not included in the package. This causes Webpack/bundler warnings about missing source files. A build/packaging issue, not a runtime bug.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified: `package.json` `files` ships `src` (minus stories) so the published source maps resolve. Dupe #542. |
| 2026-09-02 | **Reopened and fixed on master.** The 2026-09-01 entry was wrong: `src` ships, but the maps in 4.0.7 and 4.1.0 list sources as `../../src/…` (one level too deep for a map in `dist/`), so bundlers looked for `node_modules/src/…` and warned. Rollup now rewrites the paths via `scripts/sourcemap-path.cjs` (`sourcemapPathTransform`). The spec verifies every source of both built maps exists relative to `dist/`; the previous spec only checked the `files` field and passed against the broken package. Reported again by Maciej from a 4.0.7 install. |

## Regression spec

- [`__tests__/regressions/build-packaging.spec.ts`](../../__tests__/regressions/build-packaging.spec.ts) — unit-tests the path rewrite and, when `dist/` exists (always in CI, which builds first), asserts every `sources` entry starts with `../src/` and points at an existing file.
