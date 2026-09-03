# #536 — Mini map click zoom in

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/536
- **Reported by:** @KirilCycle
- **Created:** 2025-06-04
- **Deduped issues:** none
- **Area:** minimap

## Summary

Request for click-to-navigate on the MiniMap: clicking a point on the minimap
should center and zoom the main view to the corresponding area, providing quick
spatial navigation.

## Status log

| Date       | Entry                                                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below.                                                                                                                                                                                                                                                                          |
| 2026-09-02 | `MiniMap` now exposes `onClick(event, { x, y })` (content coordinates, fired only for a click/tap that did not drag) and `zoomable` (wheel over the map zooms the main view). Click-to-zoom is a one-liner: `onClick={(_, p) => zoomToPoint(2, ...contentToClient(p.x, p.y))}`. Lean close as "available via `onClick`". |

## Rating (2026-09-01)

**#536 — Discuss** · priority low · cluster `minimap`

- **Action:** Click already pans the MiniMap; decide whether click should also
  zoom (opinionated). Lean close.
- **Why:** No reactions.
