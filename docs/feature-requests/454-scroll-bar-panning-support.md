# #454 — Scroll bar panning support

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/454
- **Reported by:** @KeemoSabiZero
- **Created:** 2024-02-14
- **Deduped issues:** none
- **Area:** pan

## Summary

Request for native scrollbar integration: dragging scrollbar thumbs should pan the zoomed content, and scrollbars should reflect the current pan position. This improves discoverability and accessibility of pan navigation.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Close: out of scope** (2026-11-19 triage). The library positions content with `transform`, so native scrollbars would need a scroll-container architecture. Point to the MiniMap and to custom scrollbars built on `useTransformEffect` + `setTransform`. |
| 2026-11-19 | **Closed on GitHub** (not planned) with the comment drafted in the 2026-11-19 triage. |

## Rating (2026-09-01)

**#454 — Discuss** · priority medium · cluster `native-scrollbars`

- **Action:** 15 reactions. Decide between a `Scrollbars` companion component built on `useTransformEffect` (recommended, opt-in) and native scroll integration (rejected: the core is transform-based). Covers #317, #430, #436.
- **Why:** Most-wanted open feature after fit-to-view and two-finger pan.
