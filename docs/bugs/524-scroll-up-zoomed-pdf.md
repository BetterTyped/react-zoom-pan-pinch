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
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) (appears fixed in v4)
