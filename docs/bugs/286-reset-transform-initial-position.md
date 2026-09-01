# #286 — resetTransform ignores initialPosition and centerOnInit

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/286
- **Reported by:** @Harshita-Kanal
- **Created:** 2022-03-10
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

`resetTransform()` resets to `(0,0)` instead of the configured `initialPositionX`/`initialPositionY`. If content was centered on init via `centerOnInit`, reset does not return to that centered state.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: `resetTransform` restores the literal `initialPositionX/Y` and `initialScale`, and returns to the centred position when `centerOnInit` is set. |

## Regression spec

- [`__tests__/regressions/programmatic-api-callbacks.spec.tsx`](../../__tests__/regressions/programmatic-api-callbacks.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
