# #418 — pinch.step prop has no effect

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/418
- **Reported by:** @okanji
- **Created:** 2023-09-06
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

The `pinch.step` prop does not affect pinch zoom sensitivity. The step value is either not read or not applied in the pinch handler.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: the scale delta is proportional to `pinch.step`. |

## Regression spec

- [`__tests__/regressions/pinch-interaction.spec.tsx`](../../__tests__/regressions/pinch-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
