# #353 — Zoom in on click to mouse position

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/353
- **Reported by:** @ecemac
- **Created:** 2023-03-07
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for single-click zoom (instead of double-click) that zooms toward the mouse cursor position, similar to how map applications handle click-to-zoom.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Shipped on master.** New `zoomToPoint(scale, clientX, clientY, animationTime?, animationType?)` control anchors the zoom at client coordinates. Spec: `__tests__/features/controls/controls.zoom-to-point.spec.tsx`. |

## Rating (2026-09-01)

**#353 — Build** · priority low

- **Action:** Export the internal `handleZoomToPoint` as a `zoomToPoint(x, y, scale)` control. Single-click wiring stays in userland (it conflicts with pan-click).
- **Why:** Cheap public API; also useful for #276-style focal zooms.
