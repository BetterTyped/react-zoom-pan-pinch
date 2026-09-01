# #276 — Zoom on center using  setTransform

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/276
- **Reported by:** @ignlopezsanchez
- **Created:** 2022-02-09
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for a `setTransform` variant that zooms to or from a specific center point rather than always using the content origin. This is needed for programmatic zoom-to-cursor behavior and focal-point animations.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#276 — Close: shipped**

- **Action:** Close: `centerView(scale, animationTime, animationType)` zooms about the centre.
- **Why:** Shipped.
