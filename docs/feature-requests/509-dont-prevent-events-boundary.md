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
| 2026-11-19 | **Built on master (unreleased).** New opt-in `panning.releaseAtBounds`: when the first move of a mouse/touch pan heads into a bound the content already rests on (dominant axis, `limitToBounds` only), the pan ends without `preventDefault`, so the page scrolls or a parent carousel takes the drag. A gesture that started inside the bounds is never handed over midway. Not device-tested yet. Spec: `__tests__/features/pan/pan.release-at-bounds.spec.tsx`. |

## Rating (2026-09-01)

**#509 — Discuss** · priority medium

- **Action:** Decide whether touch panning should stop calling `preventDefault` when the content is already at the bound in the gesture direction, so the page can scroll (scroll chaining). Real mobile UX need; needs a device pass.
- **Why:** 6 reactions, 'this needs fixing' in 2025-08.
