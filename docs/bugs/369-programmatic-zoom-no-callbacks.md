# #369 — Programmatic zoom methods do not fire callbacks

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/369
- **Reported by:** @eleweek
- **Created:** 2023-04-17
- **Reported-against version:** _unverified_
- **Deduped issues:** #259, #305
- **Area:** callbacks

## Summary

Programmatic methods `zoomIn()`, `zoomOut()`, `resetTransform()`, and double-click zoom do not fire `onZoom`/`onZoomStart`/`onZoomStop` callbacks. Users cannot track zoom state changes triggered by the imperative API or double-click. Affects all callback-based integrations.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`programmatic-api-callbacks.spec.tsx`](../../__tests__/regressions/programmatic-api-callbacks.spec.tsx) (appears fixed in v4)
