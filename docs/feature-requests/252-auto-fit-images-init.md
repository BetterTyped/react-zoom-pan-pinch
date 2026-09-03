# #252 — Auto fit large images on init

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/252
- **Reported by:** @xairoo
- **Created:** 2021-10-25
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request to automatically scale large images to fit the container on initial render, providing "fit to window" behavior out of the box. Currently users must manually calculate and set the initial scale.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-02 | **Shipped on master.** New `fitOnInit` prop (`true`/`'contain'`/`'cover'`; re-applied when the content gets its size, `resetTransform` returns to it) and `fitToView({ mode, minScale, maxScale, animationTime, animationType })` control. Both honour `minScale`/`maxScale`, so large content shrinks only when `minScale` allows. Specs: `__tests__/features/props/fit-on-init.spec.tsx`, `__tests__/features/controls/controls.fit-to-view.spec.tsx`. Closes #376, #530. |
| 2026-09-02 | Follow-up: the pending initial layout also waits for the wrapper to have a size (hidden tab / collapsed panel), and the wrapper is measured by its client box so a border does not offset the fit. Storybook example: Basic/Fit Image. |

## Rating (2026-09-01)

**#252 — Build** · priority high · cluster `fit-to-view`

- **Action:** Add a first-class fit: `initialScale="fit"` (or `fitOnInit`) plus a `fitToView()` control. Today the workaround is `zoomToElement(contentEl, undefined, 0)` from `onInit`/image `onload`.
- **Why:** 22 reactions here plus #376 and #530; the 2025 #530 thread shows people still reverse-engineering the `image-responsive` story.
