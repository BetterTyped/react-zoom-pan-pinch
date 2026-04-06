# #483 — Content at wrong position on first render

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/483
- **Reported by:** @a-fortunato
- **Created:** 2024-06-28
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

Content appears at the wrong position on first render, then corrects itself on interaction. Likely a race between initial state setup and DOM measurement.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) (appears fixed in v4)
