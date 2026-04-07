# #506 — Pinch zoom broken in v3.6.1+ — whole page zooms

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/506
- **Reported by:** @ifancyabroad
- **Created:** 2024-09-17
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Pinch zoom stopped working entirely in v3.6.1+. Instead of zooming the element, the entire page zooms. The `touch-action` CSS or `preventDefault` handling regressed. Works correctly in v3.5.1.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/css-and-styles.spec.tsx`** — **FAILING**. Asserts the wrapper does not set `touch-action: none` in applied styles (regression tied to page-level pinch zoom).
