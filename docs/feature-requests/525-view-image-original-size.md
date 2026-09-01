# #525 — Option to View Image at Original Size

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/525
- **Reported by:** @sarapotyscki
- **Created:** 2025-02-11
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for a "view at original size" (100% zoom / 1:1 pixel mapping) button or API, a standard feature in image viewers that lets users inspect content at native resolution.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#525 — Close: shipped** · cluster `fit-to-view`

- **Action:** Close: `centerView(1)` (or `setTransform(x, y, 1)`) shows the content at 1:1. Could become a `zoomToScale` alias when #252 lands.
- **Why:** Already possible; keep in the fit cluster for the docs page.
