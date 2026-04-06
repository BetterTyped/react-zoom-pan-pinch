# #431 — Scale increment calculation regressed in v3.3.0

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/431
- **Reported by:** @cheolhow
- **Created:** 2023-10-24
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

`zoomIn(0.5)` does not reliably increase scale by 0.5 when `initialScale` is 1. The scale increment calculation was fixed in PR #367 for v3.0.7 but regressed in v3.3.0.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) (appears fixed in v4)
