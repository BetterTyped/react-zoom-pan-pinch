# #527 — Controls to move left/right/up/down

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/527
- **Reported by:** @ashleyryan
- **Created:** 2025-02-28
- **Deduped issues:** none
- **Area:** controls

## Summary

Request for directional pan controls (left, right, up, down buttons) for keyboard-accessible navigation. Important for accessibility compliance and users who cannot use pointer-based gestures.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#527 — Close: dupe** · duplicate of #254 · cluster `keyboard-a11y`

- **Action:** Close as part of #254: a `panBy(dx, dy)` control covers directional buttons. Until then `setTransform(positionX ± n, positionY, scale)` works (see the 2025-03 comment).
- **Why:** Same feature from the button side.
