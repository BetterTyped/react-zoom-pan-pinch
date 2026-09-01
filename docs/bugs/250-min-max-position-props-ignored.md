# #250 — minPosition/maxPosition props have no effect

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/250
- **Reported by:** @lostfictions
- **Created:** 2021-10-04
- **Reported-against version:** _unverified_
- **Deduped issues:** #478
- **Area:** bounds

## Summary

The `minPositionX`, `maxPositionX`, `minPositionY`, `maxPositionY` props have no visible effect on panning boundaries. The bounds calculation code ignores these user-provided values when computing allowed pan range.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: explicit `maxPositionX` / `minPositionX` clamp to the exact scaled bound (100 and -700 at scale 2). Dupe #478. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
