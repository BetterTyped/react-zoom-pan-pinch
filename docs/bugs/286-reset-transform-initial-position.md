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
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
