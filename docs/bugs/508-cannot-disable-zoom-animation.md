# #508 — zoomAnimation.disabled does not remove animation

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/508
- **Reported by:** @asnoeyink
- **Created:** 2024-09-26
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Setting `zoomAnimation.disabled: true` does not remove the animation. Users must set `animationTime: 0` as a workaround. The disabled flag is not checked in the animation path.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified fixed on master: with `zoomAnimation.disabled` a programmatic zoom applies synchronously and the elastic snap-back animation is skipped. |

## Regression spec

- [`__tests__/regressions/velocity-animation.spec.tsx`](../../__tests__/regressions/velocity-animation.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
