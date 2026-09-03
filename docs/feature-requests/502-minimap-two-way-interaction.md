# #502 — Add two way interaction for MiniMap

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/502
- **Reported by:** @welanderr
- **Created:** 2024-08-24
- **Deduped issues:** none
- **Area:** minimap

## Summary

Request for bidirectional MiniMap interaction: clicking or dragging on the
MiniMap should navigate the main viewport to the corresponding position, making
the MiniMap a full navigation control.

## Status log

| Date       | Entry                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-09-02 | Drag reworked: pressing the map no longer centres the indicator on the cursor (which threw the view into a corner); the drag now grabs the indicator and moves it 1:1 with the mouse/finger, clamped to the bounds. Map now shows the union of content and viewport with `offsetScale` padding and an SVG mask, like React Flow. Added `inversePan`, `zoomable`/`zoomStep`, `maskColor`, `onClick`. Specs: `__tests__/features/minimap/minimap.panning.spec.tsx`, `minimap.sync.spec.tsx`. |

## Rating (2026-09-01)

**#502 — Close: shipped** · cluster `minimap`

- **Action:** Close: `MiniMap` `panning` (default `true`) navigates on click and
  drag.
- **Why:** Shipped in v4.
