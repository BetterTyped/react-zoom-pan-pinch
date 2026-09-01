# #443 — onPanning not fired during velocity/inertia panning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/443
- **Reported by:** @ZayneLu
- **Created:** 2024-01-04
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** callbacks

## Summary

The `onPanning` callback is not fired during velocity-driven (inertia) panning after the user lifts their finger. Only direct user-driven pan moves trigger the callback.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: `onPanning` keeps firing during the post-release inertia animation. |

## Regression spec

- [`__tests__/regressions/velocity-animation.spec.tsx`](../../__tests__/regressions/velocity-animation.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
