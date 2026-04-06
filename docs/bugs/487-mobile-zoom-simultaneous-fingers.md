# #487 — Pinch-to-zoom fails with simultaneous finger placement

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/487
- **Reported by:** @MarwanEsm
- **Created:** 2024-07-03
- **Reported-against version:** _unverified_
- **Deduped issues:** #513
- **Area:** pinch

## Summary

Pinch-to-zoom fails on mobile when both fingers touch the screen simultaneously. The library expects sequential finger placement (first finger down, then second). When both arrive in the same touch event, the gesture is not recognized. #513 reports the same for SVG content.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
