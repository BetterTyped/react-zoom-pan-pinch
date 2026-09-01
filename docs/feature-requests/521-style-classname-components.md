# #521 — Allow to pass style/className to TransformWrapper & TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/521
- **Reported by:** @caub
- **Created:** 2024-12-08
- **Deduped issues:** none
- **Area:** styling

## Summary

Request to pass custom `style` and `className` props to `TransformWrapper` and `TransformComponent` for layout customization without resorting to global CSS overrides.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#521 — Close: shipped**

- **Action:** Close: `TransformComponent` takes `wrapperClass`, `contentClass`, `wrapperStyle`, `contentStyle`, `wrapperProps`, `contentProps`. `TransformWrapper` renders no DOM.
- **Why:** Confirmed by a commenter in 2025-08.
