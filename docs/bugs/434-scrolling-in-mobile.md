# #434 — Page scrolling blocked on mobile by TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/434
- **Reported by:** @gabifuse
- **Created:** 2023-11-08
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Native page scrolling is blocked on mobile devices when the TransformComponent is in the viewport. Even with panning disabled, touch events are captured and `preventDefault`ed, breaking scroll.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
