# #538 — touchmove preventDefault on non-cancelable event warning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/538
- **Reported by:** @sarfrajadstreaks
- **Created:** 2025-06-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Console warning: "Ignored attempt to cancel a touchmove event with cancelable=false". The library calls `event.preventDefault()` on passive touch events, which browsers now reject. Needs proper passive event option handling.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: a non-cancelable `touchmove` is never prevented (positive control: a cancelable one during a pan is). |

## Regression spec

- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
