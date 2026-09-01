# #515 — zoomToElement with max/min scale support

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/515
- **Reported by:** @kelvinkoko
- **Created:** 2024-11-06
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for `zoomToElement` to accept `maxScale`/`minScale` constraints, preventing over-zoom when targeting very small elements or under-zoom on large ones.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Shipped on master.** `zoomToElement(node, { minScale, maxScale, scale, animationTime, animationType, offsetX, offsetY })` caps the automatic fit scale. Spec: `__tests__/features/zoom-to-element/zoom-to-element.targets.spec.tsx`. |

## Rating (2026-09-01)

**#515 — Build** · priority low

- **Action:** Add an options object to `zoomToElement` (`{ maxScale, minScale }`) so the auto-fit scale can be capped without passing an explicit scale.
- **Why:** Small; the auto scale is already clamped to the wrapper's `minScale/maxScale`.
