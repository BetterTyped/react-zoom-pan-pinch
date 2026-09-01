# #438 — minScale not enforced with Ctrl+scroll zoom-out

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/438
- **Reported by:** @AnnaLysiuk
- **Created:** 2023-11-22
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `minScale` bound is not enforced when zooming out with Ctrl+scroll (keyboard-modified wheel). The scale drops below the configured minimum.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **By design (documented).** Documented as elastic by design: ctrl+wheel (trackpad pinch) may stretch below `minScale` by `zoomAnimation.size` during the gesture and snaps back to exactly `minScale`; `disablePadding` (or `zoomAnimation.disabled`) keeps the scale at `minScale` at all times. The previous spec sanctioned the overshoot without saying so. Recommend closing with that guidance. |

## Regression spec

- [`__tests__/regressions/zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
