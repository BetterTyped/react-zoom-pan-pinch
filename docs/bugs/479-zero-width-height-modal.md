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
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/component-lifecycle.spec.tsx`** — **PASSING**. Asserts the library handles zero wrapper dimensions without crashing and recovers when dimensions become non-zero (dialog / late layout timing class of bugs).
