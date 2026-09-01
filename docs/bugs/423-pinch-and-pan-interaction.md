# #423 — Cannot pan during pinch gesture

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/423
- **Reported by:** @k2xl
- **Created:** 2023-09-23
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Users want to pan while pinch-zooming. Currently panning is disabled during pinch gestures, but the `pinch.allowPanning` prop either doesn't work or doesn't exist.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master with a pure two-finger translation (constant finger distance): `pinch.allowPanning: true` moves the content by the finger delta, `false` and `panning.disabled` do not. |

## Regression spec

- [`__tests__/regressions/pinch-interaction.spec.tsx`](../../__tests__/regressions/pinch-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
