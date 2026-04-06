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
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/programmatic-api-callbacks.spec.tsx`** — **PASSING**. The test was rewritten to pan while the DOM inside the content is mutated, verifying `onPanning` keeps firing with consistent behavior. Appears fixed in v4 for this scenario.
