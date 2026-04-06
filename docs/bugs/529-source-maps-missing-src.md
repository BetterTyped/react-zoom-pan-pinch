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
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/css-and-styles.spec.tsx`** — **FAILING**. Asserts `package.json` `files` does not include `src/` (published maps still reference missing sources until packaging is fixed).
