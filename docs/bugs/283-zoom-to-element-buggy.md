# #283 — zoomToElement calculates incorrect position and scale

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/283
- **Reported by:** @sikandarchishty
- **Created:** 2022-02-22
- **Reported-against version:** _unverified_
- **Deduped issues:** #343, #540
- **Area:** zoom

## Summary

`zoomToElement` calculates incorrect target position and scale, especially in wide containers. The element doesn't center in viewport as expected. #540 reports the Storybook example page crashes entirely when using this feature.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master with an offset target inside a wide 800×400 wrapper: the target lands on the wrapper centre for a custom scale and for the fitted scale; string ids resolve in the wrapper's own document. Dupes #343, #540. |

## Regression spec

- [`__tests__/regressions/component-lifecycle.spec.tsx`](../../__tests__/regressions/component-lifecycle.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
