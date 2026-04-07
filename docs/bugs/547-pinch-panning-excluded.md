# #547 — Pinch blocked by panning.excluded class

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/547
- **Reported by:** @rkawkxkdwlq
- **Created:** 2025-09-12
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Pinch-to-zoom does not work on elements that have the `panning.excluded` class. The exclusion check incorrectly blocks pinch gestures too, not just panning.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`pinch-interaction.spec.tsx`](../../__tests__/regressions/pinch-interaction.spec.tsx) (appears fixed in v4)
