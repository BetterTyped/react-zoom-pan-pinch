# #396 — limitToBounds fails with touchpad gestures

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/396
- **Reported by:** @dkueng01
- **Created:** 2023-07-11
- **Reported-against version:** _unverified_
- **Deduped issues:** #433
- **Area:** bounds

## Summary

`limitToBounds` does not properly constrain panning when using a touchpad (trackpad scroll gestures). Content can be panned outside boundaries. #433 adds that bounds recalculation also fails on window resize.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
