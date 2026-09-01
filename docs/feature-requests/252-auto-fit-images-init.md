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

## Rating (2026-09-01)

**#252 — Build** · priority high · cluster `fit-to-view`

- **Action:** Add a first-class fit: `initialScale="fit"` (or `fitOnInit`) plus a `fitToView()` control. Today the workaround is `zoomToElement(contentEl, undefined, 0)` from `onInit`/image `onload`.
- **Why:** 22 reactions here plus #376 and #530; the 2025 #530 thread shows people still reverse-engineering the `image-responsive` story.
