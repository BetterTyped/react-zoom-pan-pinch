# #241 — Double-click zoom-out does not work

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/241
- **Reported by:** @zulqarnain-empg-zz
- **Created:** 2021-09-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Double-click zoom-out does not work in the demo. First double-click zooms in, but subsequent double-clicks fail to zoom back out as expected.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: double-click toggle zooms 1 → 1.7 → 1 (the midpoint is asserted so a no-op double-click cannot pass). |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
