# #408 — Rapid double-click causes random panning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/408
- **Reported by:** @Tom-Keeley
- **Created:** 2023-08-10
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Rapidly double-clicking to zoom causes the content to pan randomly. The animation from one double-click hasn't settled before the next fires, creating compounding position errors.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) (appears fixed in v4)
