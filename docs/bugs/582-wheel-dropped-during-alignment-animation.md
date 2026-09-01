# #582 — Wheel input dropped 100–160 ms after the previous wheel event

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/582
- **Reported by:** @itsUndefined
- **Created:** 2026-08-19
- **Reported-against version:** 4.0.4
- **Deduped issues:** none
- **Area:** wheel

## Summary

A wheel event that arrives 100–160 ms after the previous one is silently ignored.
`handleWheelStop` schedules `handleAlignToScaleBounds` after `wheelAnimationTime`
(100 ms). That runs `handleAlignToBounds`, which starts a 200 ms
`autoAlignment` animation even when the target state equals the current state.
`handleWheelStart` only cancels animations while `wheelStopEventTimer` (160 ms)
is null and `handleWheelZoom` never cancels, so in the 100–160 ms window the
zoom's `setState` is overwritten by the animation's next frame. Feels like
"zoom randomly ignores a flick after a short pause". Not direction- or
bounds-specific. The reporter's measured dead band matches the two timers.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Confirmed on master.** Code path verified in `wheel.logic.ts`, `zoom.logic.ts` and `panning.logic.ts`. Fix: cancel the alignment animation from `handleWheelZoom` (or key the guard to `wheelAnimationTimer`) and skip `handleAlignToBounds` when `handlePanToBounds` returns the current state. |
| 2026-09-01 | **Fixed on master.** `handleWheelStart`/`handleWheelPanningStart` cancel a running animation on every wheel event, and `handleAlignToBounds` no longer starts a no-op animation. Spec: `__tests__/regressions/wheel-alignment-window.spec.tsx` (fails on the previous code at 90/106/121/141 ms gaps). |

## Regression spec

- To add: fake-timer spec firing 6 wheel events, waiting 90/120/150 ms, then asserting the next event changes `scale`.

## Rating (2026-09-01)

**#582 — Fix** · priority high

- **Action:** Fix in `handleWheelZoom`/`handleWheelStart`: cancel the running alignment animation (or key the cancel guard to `wheelAnimationTimer`), and skip `handleAlignToBounds` when the target equals the current state. Add a fake-timer regression spec for gaps of 90/120/150 ms.
- **Why:** Confirmed in code on master: `handleWheelStop` schedules `handleAlignToScaleBounds` after 100 ms; that runs `handleAlignToBounds`, which animates for `autoAlignment.animationTime` (200 ms) even when the target equals the current state. `handleWheelStart` only cancels animations while `wheelStopEventTimer` (160 ms) is null and `handleWheelZoom` never cancels, so a wheel event in the 100–160 ms window has its `setState` overwritten by the next animation frame. Reporter's analysis and repro are accurate.
