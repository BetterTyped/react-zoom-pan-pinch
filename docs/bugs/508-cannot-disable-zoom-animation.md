# #508 — zoomAnimation.disabled does not remove animation

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/508
- **Reported by:** @asnoeyink
- **Created:** 2024-09-26
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Setting `zoomAnimation.disabled: true` does not remove the animation. Users must set `animationTime: 0` as a workaround. The disabled flag is not checked in the animation path.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
