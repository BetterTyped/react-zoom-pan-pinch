# #463 — centerZoomedOut={false} does not prevent centering

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/463
- **Reported by:** @rkvirajgupta
- **Created:** 2024-03-20
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Setting `centerZoomedOut={false}` does not prevent content from being centered when zoomed out below scale 1. The flag is either not read or the condition is inverted.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) (appears fixed in v4)
