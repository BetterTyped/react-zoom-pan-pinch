# #406 — Zoom-in behavior is erratic and overshoots

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/406
- **Reported by:** @aleksvalushko
- **Created:** 2023-08-10
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Zoom-in behavior is erratic: the zoom level jumps inconsistently or overshoots. Likely related to the wheel step calculation or animation timing.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/zoom-behavior.spec.tsx`** — **PASSING**. The test was rewritten to assert zoom targets the **cursor** position (not an arbitrary fixed point). It passes; erratic zoom-at-wrong-anchor behavior appears fixed in v4 for what the spec covers.
