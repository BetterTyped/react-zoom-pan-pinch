# #432 — onPanning fires inconsistently with incorrect state

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/432
- **Reported by:** @aleksvalushko
- **Created:** 2023-10-31
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** callbacks

## Summary

The `onPanning` callback fires inconsistently or with incorrect state data. Reported as unreliable for tracking pan position in real-time.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: `onPanning` reports monotonically updated positions on every move, before and after the content DOM changes. |

## Regression spec

- [`__tests__/regressions/programmatic-api-callbacks.spec.tsx`](../../__tests__/regressions/programmatic-api-callbacks.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
