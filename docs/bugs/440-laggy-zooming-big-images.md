# #440 — Zooming on large images causes lag

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/440
- **Reported by:** @montasellx
- **Created:** 2023-12-12
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

Zooming on large images causes noticeable lag/jank. The CSS transform triggers expensive repaints on high-resolution images.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: repaint performance on large images; no code change. |

## Regression spec

- N/A — performance, not a correctness assertion.

## Rating (2026-09-01)

**#440 — Close: not worth** · duplicate of #401 · cluster `render-performance`

- **Action:** Close with the same performance guide as #401.
- **Why:** 2025-09 comment confirms `will-change: transform` blurs SVG; there is no library-side fix for GPU rasterisation limits.
