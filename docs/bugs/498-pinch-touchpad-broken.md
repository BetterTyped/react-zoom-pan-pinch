# #498 — Pinch props have no effect on touchpad pinch gestures

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/498
- **Reported by:** @rrkoshta123
- **Created:** 2024-08-09
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Pinch-related props (`pinch.step`, `pinch.disabled`, `onPinching`) have no effect on touchpad pinch gestures. The touchpad pinch events may be routed through the wheel handler instead.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`pinch-interaction.spec.tsx`](../../__tests__/regressions/pinch-interaction.spec.tsx) (appears fixed in v4)
