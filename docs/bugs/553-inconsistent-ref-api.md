# #553 — Ref object has inconsistent structure

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/553
- **Reported by:** @MagdalenaMajchrzak
- **Created:** 2026-02-06
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

The ref object returned by TransformWrapper has inconsistent structure: sometimes `ref.current.state` exists, sometimes only `ref.current.instance.transformState`. The shape depends on render timing and causes TypeScript errors.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: the ref has the same shape from the render prop, `onInit` and `ref.current`; `ref.state` is the live state object shared with `instance.state` (documented). |

## Regression spec

- [`__tests__/regressions/programmatic-api-callbacks.spec.tsx`](../../__tests__/regressions/programmatic-api-callbacks.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
