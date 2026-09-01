# #214 — Fire events or callbacks at zoomIn, zoomToElement etc...?

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/214
- **Reported by:** @nodepond
- **Created:** 2021-06-30
- **Deduped issues:** none
- **Area:** callbacks

## Summary

Request for a callback or event that fires when programmatic zoom animations (`zoomIn`, `zoomOut`, `zoomToElement`) finish. Users need to know exactly when the animation completes to trigger follow-up actions like fetching higher-resolution tiles.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Shipped on master.** `zoomIn`, `zoomOut`, `setTransform`, `resetTransform`, `centerView`, `zoomToElement` and the new `zoomToPoint` return a `Promise<void>` that settles when the animation finishes, is interrupted, or the component unmounts. Spec: `__tests__/features/controls/controls.promises.spec.tsx`. |

## Rating (2026-09-01)

**#214 — Build** · priority high

- **Action:** Give `zoomIn/zoomOut/setTransform/resetTransform/centerView/zoomToElement` a completion signal: return a Promise resolved when `animate` finishes (or accept an `onComplete`). `animate` currently has no end hook.
- **Why:** 16 reactions. Programmatic zooms fire `onZoom*` since 665bff5, but nothing tells the caller when the animation is done.
