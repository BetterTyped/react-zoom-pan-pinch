# #404 — Trackpad gestures not recognized on iOS

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/404
- **Reported by:** @vilola
- **Created:** 2023-08-08
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Trackpad gestures on iOS (iPad with keyboard/trackpad) are not recognized. The library's wheel event heuristic for detecting trackpad vs mouse wheel fails on certain platforms.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Partially addressed.** Partially verified in jsdom: ctrl+wheel with pixel deltas zooms and the step scales with `|deltaY|`; `wheel.touchPadDisabled` opts out; pixel-mode wheel pans when zoom is disabled. There is no `deltaMode` / `wheelDeltaY` device heuristic (`isTrackPad` in `src/utils/event.utils.ts` is unused). iPad-specific recognition still needs device testing. |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
