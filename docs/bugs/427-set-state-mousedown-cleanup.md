# #427 — Parent setState breaks mousedown listener

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/427
- **Reported by:** @lesjames
- **Created:** 2023-10-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Calling `setState` in a parent component above `TransformWrapper` causes the mousedown listener to be cleaned up. Subsequent pan gestures fail because the component re-mounts and loses event binding.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: every move of a pan whose `onPanning` re-renders the parent is applied (exact transform) and the next gesture still works. |

## Regression spec

- [`__tests__/regressions/component-lifecycle.spec.tsx`](../../__tests__/regressions/component-lifecycle.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
