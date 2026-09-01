# #323 — wheel.activationKeys does not gate wheel zoom

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/323
- **Reported by:** @nnha19
- **Created:** 2023-01-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `wheel.activationKeys` prop does not gate wheel zoom as documented. Wheel zoom fires regardless of whether the specified key is held.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: wheel zoom is gated by `wheel.activationKeys`. |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
