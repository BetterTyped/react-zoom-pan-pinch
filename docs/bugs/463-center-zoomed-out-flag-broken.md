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
| 2026-09-01 | **Verified fixed.** Verified fixed on master: `centerZoomedOut: false` keeps the panned position exactly (80, 60); the mirror case with `true` snaps to (62.5, 62.5). |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
