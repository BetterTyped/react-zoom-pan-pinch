# #495 — wheel.step prop does not change zoom sensitivity

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/495
- **Reported by:** @MartinArauz
- **Created:** 2024-07-07
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `wheel.step` prop does not change zoom sensitivity. Regardless of the value passed, wheel zoom uses the default step size.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) (appears fixed in v4)
