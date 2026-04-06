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
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
