# #406 — Zoom-in behavior is erratic and overshoots

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/406
- **Reported by:** @aleksvalushko
- **Created:** 2023-08-10
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Zoom-in behavior is erratic: the zoom level jumps inconsistently or overshoots. Likely related to the wheel step calculation or animation timing.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: wheel zoom anchors on the cursor (`position = -cursor * Δscale`) and consecutive events add exactly one step each. Programmatic `zoomIn` is linear as well (see #431 / #545). |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
