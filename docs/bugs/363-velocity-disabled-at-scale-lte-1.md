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
| 2026-04-06 | Fixed: replaced `scale > 1` guard in `isVelocityCalculationAllowed` with content-overflow check (`offsetWidth * scale` vs wrapper). Also fixed `isVelocityAllowed` using `\|\|` instead of `&&`, and switched `handlePanningEnd` from `getBoundingClientRect` to `offsetWidth * scale` with `!limitToBounds` bypass. |

## Regression spec

- **`__tests__/regressions/velocity-animation.spec.tsx`** — 4 tests covering: scale-1 velocity with `limitToBounds: false`, big-image overflow at scale 1, zoom-in-then-reset, and negative case (content fits = no velocity).
