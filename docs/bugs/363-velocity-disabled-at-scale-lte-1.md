# #363 — Panning velocity hardcoded off when scale <= 1

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/363
- **Reported by:** @kotcrab
- **Created:** 2023-03-28
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Panning velocity/inertia is explicitly disabled when `scale <= 1` in the source code (`velocity.utils.ts`). Users expect velocity to work at any zoom level. This is a hardcoded restriction that should respect the `velocityAnimation.disabled` prop instead.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/velocity-animation.spec.tsx`** — **Failing** on v4 (confirmed bug).
