# #388 — Zoom to multiple elements

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/388
- **Reported by:** @fromi
- **Created:** 2023-06-28
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for a `zoomToElements` (plural) API that calculates the bounding box of multiple target elements and zooms to fit them all in view simultaneously.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Shipped on master.** `zoomToElement` accepts an element, an id, or an array of either and frames the union rect. Spec: `__tests__/features/zoom-to-element/zoom-to-element.targets.spec.tsx`. |

## Rating (2026-09-01)

**#388 — Build** · priority medium

- **Action:** Accept `HTMLElement | HTMLElement[] | string | string[]` in `zoomToElement` and fit the union rect. The reporter offered a PR; a contributor bumped it 2026-08-19.
- **Why:** Small change inside `calculateZoomToNode`.
