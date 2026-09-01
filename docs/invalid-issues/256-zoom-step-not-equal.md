# #256 — Step for zoom in and zoom out not equal

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/256
- **Category:** question

## Reason

The user observes that zoom-in and zoom-out produce different step sizes. This is expected mathematical behavior — multiplicative scaling (e.g. ×1.5 in, ÷1.5 out) produces visually asymmetric steps relative to absolute scale values. This is not a bug but a natural property of how scaling works.

## Rating (2026-09-01)

**#256 — Close: fixed** · cluster `linear-step`

- **Action:** Close: zoomIn/zoomOut steps are linear and symmetric since 76fa606.
- **Why:** Behaviour decision recorded 2026-09-01.
