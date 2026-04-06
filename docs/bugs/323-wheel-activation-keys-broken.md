# #323 — wheel.activationKeys does not gate wheel zoom

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/323
- **Reported by:** @nnha19
- **Created:** 2023-01-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

The `wheel.activationKeys` prop does not gate wheel zoom as documented. Wheel zoom fires regardless of whether the specified key is held.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

**PASSING** — [`zoom-behavior.spec.tsx`](../../__tests__/regressions/zoom-behavior.spec.tsx) (appears fixed in v4)
