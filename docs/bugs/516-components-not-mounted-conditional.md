# #516 — "Components are not mounted" with conditional rendering

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/516
- **Reported by:** @mhryshkin
- **Created:** 2024-11-18
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

If `TransformComponent` is rendered conditionally (delayed or inside a lazy-loaded subtree), the library throws "Components are not mounted". The component registration doesn't handle async mounting.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed and verified: a deferred `TransformComponent` initializes and handles gestures, controls called before it exists do not throw, and unmount/remount keeps working. On unmount every timer, animation frame and listener is now cleared (the `mounted` flag never used to turn false). |

## Regression spec

- [`__tests__/regressions/component-lifecycle.spec.tsx`](../../__tests__/regressions/component-lifecycle.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/lifecycle-unmount.spec.tsx`](../../__tests__/regressions/lifecycle-unmount.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
