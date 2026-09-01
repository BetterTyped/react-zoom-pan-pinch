# #524 — Content above focal point unreachable when zoomed into PDF

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/524
- **Reported by:** @madsone
- **Created:** 2025-02-04
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** bounds

## Summary

When zoomed into a PDF viewer inside TransformComponent, content above the zoom focal point becomes unreachable. The bounds calculation doesn't account for content above the viewport.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: after zooming on a focal point near the bottom, both the top and the bottom content edge are reachable by panning. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
