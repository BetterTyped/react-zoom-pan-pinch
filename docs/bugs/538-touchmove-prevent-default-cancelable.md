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
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/pan-interaction.spec.tsx`** — **FAILING**. Asserts `onTouchPanning` calls `preventDefault` without checking `event.cancelable` (matches the browser warning on non-cancelable touchmove).
