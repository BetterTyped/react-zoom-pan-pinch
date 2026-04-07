# #392 — centerOnInit does not reliably center on first render

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/392
- **Reported by:** @umeeridrees
- **Created:** 2023-07-08
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

The `centerOnInit` prop does not reliably center content on first render. Timing issues with DOM measurement (element dimensions not yet available when centering runs) cause incorrect initial positioning.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) (appears fixed in v4)
