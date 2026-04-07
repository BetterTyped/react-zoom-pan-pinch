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
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — mobile GPU/paint performance; not a correctness assertion.
