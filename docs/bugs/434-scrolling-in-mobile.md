# #434 — Page scrolling blocked on mobile by TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/434
- **Reported by:** @gabifuse
- **Created:** 2023-11-08
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Native page scrolling is blocked on mobile devices when the TransformComponent is in the viewport. Even with panning disabled, touch events are captured and `preventDefault`ed, breaking scroll.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified for the reported configuration: with `panning.disabled` a cancelable `touchmove` is not prevented, so native page scroll works. With panning enabled the `touchmove` is cancelled while a pan is active (by design). A mobile device pass is still recommended. |

## Regression spec

- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
