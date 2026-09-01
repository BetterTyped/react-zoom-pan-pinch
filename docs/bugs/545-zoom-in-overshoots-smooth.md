# #545 — zoomIn with smooth option overshoots target scale

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/545
- **Reported by:** @madsone
- **Created:** 2025-09-05
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

`zoomIn(step)` with `smooth: true` overshoots the expected scale. For example, `zoomIn(0.25)` from scale 1.0 results in scale ~1.35 instead of 1.25. The smooth animation applies the step as an easing target rather than a final increment.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed: `zoomIn(0.25)` from 1 lands on 1.25 under the default props (was 1.284 because the step was applied exponentially under `smooth: true`); the previous spec had switched `smooth` off to go green. Same change as #431. |

## Regression spec

- [`__tests__/regressions/velocity-animation.spec.tsx`](../../__tests__/regressions/velocity-animation.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
