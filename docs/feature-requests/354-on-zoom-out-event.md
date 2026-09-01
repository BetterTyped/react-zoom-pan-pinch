# #354 — onZoomOut event

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/354
- **Reported by:** @vutpov
- **Created:** 2023-03-09
- **Deduped issues:** none
- **Area:** callbacks

## Summary

Request for a dedicated `onZoomOut` event/callback that fires specifically on zoom-out actions. Currently only `onZoom` is available and fires for both directions, requiring consumers to diff scale values manually.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#354 — Close: not worth**

- **Action:** Close: `onZoom` receives `state.previousScale`, so direction is `scale < previousScale`.
- **Why:** No new callback needed.
