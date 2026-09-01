# #467 — Text selection and copy broken inside TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/467
- **Reported by:** @rkvirajgupta
- **Created:** 2024-03-28
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Text selection and copy (Ctrl+C / Cmd+C) does not work on content inside TransformComponent. The mousedown/mousemove handlers for panning prevent the browser's native text selection.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Open.** Still open: `.wrapper { user-select: none }` is what blocks selection and copy. The previous spec listed that rule as the fix for this issue; it is now a plain CSS-contract pin. A fix would scope `user-select: none` to active gestures only. |

## Regression spec

- N/A — no regression test until the CSS is gesture-scoped.
