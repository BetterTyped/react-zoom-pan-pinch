# #439 — Initial image position wrong with cache disabled in Chrome

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/439
- **Reported by:** @rsbrowne
- **Created:** 2023-12-12
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

When browser cache is disabled in Chrome, the initial image position is calculated incorrectly. The component measures dimensions before the image has loaded, getting zero-size values.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: with `centerOnInit` the `ResizeObserver` re-centres once the content gets its real size (late image load). |

## Regression spec

- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
