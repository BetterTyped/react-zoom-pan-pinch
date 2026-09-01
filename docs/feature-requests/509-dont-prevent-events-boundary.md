# #509 — Don't prevent events for panning when image has reached the boundary

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/509
- **Reported by:** @Frrede
- **Created:** 2024-09-27
- **Deduped issues:** none
- **Area:** pan

## Summary

Request to stop calling `preventDefault` on pan events when the content has reached its boundary. This would let parent scrollable containers take over naturally when the user pans past the edge.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#509 — Discuss** · priority medium

- **Action:** Decide whether touch panning should stop calling `preventDefault` when the content is already at the bound in the gesture direction, so the page can scroll (scroll chaining). Real mobile UX need; needs a device pass.
- **Why:** 6 reactions, 'this needs fixing' in 2025-08.
