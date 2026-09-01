# #526 — Severe performance degradation with large SVG on Android

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/526
- **Reported by:** @ThinhDangDev
- **Created:** 2025-02-19
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Large SVG content (5MB+ map) causes severe performance degradation on Android devices. iOS handles the same content smoothly. Likely related to Android's CSS transform rendering pipeline.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: Android GPU/paint performance; no code change. |

## Regression spec

- N/A — performance, not a correctness assertion.

## Rating (2026-09-01)

**#526 — Close: not worth** · duplicate of #401 · cluster `render-performance`

- **Action:** Close with the same performance guide as #401.
- **Why:** Android GPU rasterisation of a 5 MB SVG; not a library defect.
