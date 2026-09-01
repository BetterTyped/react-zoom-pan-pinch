# #364 — Zoom level changes inconsistently on window resize

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/364
- **Reported by:** @strokine
- **Created:** 2023-03-30
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

When the browser window is resized, the zoom level changes inconsistently. The component recalculates scale relative to new container dimensions without preserving the user's intended zoom level.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Cannot reproduce.** Cannot reproduce in v4: the library does not react to window resize at all, so the scale cannot change on resize; bounds are recomputed when the next gesture starts. Possible enhancement: observe wrapper size changes to refresh bounds eagerly. |

## Regression spec

- [`__tests__/regressions/component-lifecycle.spec.tsx`](../../__tests__/regressions/component-lifecycle.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
