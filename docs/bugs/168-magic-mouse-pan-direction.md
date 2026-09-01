# #168 — Magic Mouse swipe triggers zoom instead of pan

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/168
- **Reported by:** @JossWritesCode
- **Created:** 2021-02-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Swiping left/right on Apple Magic Mouse while zoomed in triggers zoom instead of panning. The trackpad scroll events are misinterpreted as zoom wheel events.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed: a wheel event with `deltaY === 0` (Magic Mouse / trackpad horizontal swipe) no longer counts as a zoom-out; with `trackPadPanning` enabled it pans horizontally instead (`isWheelAllowed` in `src/core/wheel/wheel.utils.ts`). Verified with default props and with trackpad panning. |

## Regression spec

- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
