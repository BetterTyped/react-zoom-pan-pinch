# #396 — limitToBounds fails with touchpad gestures

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/396
- **Reported by:** @dkueng01
- **Created:** 2023-07-11
- **Reported-against version:** _unverified_
- **Deduped issues:** #433
- **Area:** bounds

## Summary

`limitToBounds` does not properly constrain panning when using a touchpad (trackpad scroll gestures). Content can be panned outside boundaries. #433 adds that bounds recalculation also fails on window resize.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed: trackpad panning only computed its bounds at mount, so after any zoom it clamped to the wrong range (the old spec asserted scale clamping instead and hid this). Bounds are now recalculated when a trackpad pan starts (`handleWheelPanningStart` in `src/core/wheel/wheel.logic.ts`). Dupe #433. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
