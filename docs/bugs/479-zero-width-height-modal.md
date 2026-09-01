# #479 — Zero dimensions when rendered inside dialog modal

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/479
- **Reported by:** @ritvij14
- **Created:** 2024-06-20
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

TransformWrapper and TransformComponent report 0 width/height when rendered inside a `<dialog>` modal element. The component measures dimensions before the modal is visible, getting zero values.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified on master: zero wrapper and content sizes do not throw or produce NaN, and centring works once real sizes appear. |

## Regression spec

- [`__tests__/regressions/component-lifecycle.spec.tsx`](../../__tests__/regressions/component-lifecycle.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
