# #392 — centerOnInit does not reliably center on first render

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/392
- **Reported by:** @umeeridrees
- **Created:** 2023-07-08
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

The `centerOnInit` prop does not reliably center content on first render. Timing issues with DOM measurement (element dimensions not yet available when centering runs) cause incorrect initial positioning.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: centering happens synchronously during mount, and initialization now runs in a layout effect so it is applied before the first paint. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/first-paint.spec.tsx`](../../__tests__/regressions/first-paint.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
