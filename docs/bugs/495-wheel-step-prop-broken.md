# #495 — wheel.step prop does not change zoom sensitivity

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/495
- **Reported by:** @MartinArauz
- **Created:** 2024-07-07
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `wheel.step` prop does not change zoom sensitivity. Regardless of the value passed, wheel zoom uses the default step size.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master with exact values: six wheel ticks give 1.12 at step 0.02 and 1.72 at step 0.12. |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
