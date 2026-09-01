# #483 — Content at wrong position on first render

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/483
- **Reported by:** @a-fortunato
- **Created:** 2024-06-28
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

Content appears at the wrong position on first render, then corrects itself on interaction. Likely a race between initial state setup and DOM measurement.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: `initialPositionX` is applied in the first render (asserted synchronously). Initialization now runs in a layout effect so `centerOnInit` and virtualized children are also correct before the first paint. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/first-paint.spec.tsx`](../../__tests__/regressions/first-paint.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
