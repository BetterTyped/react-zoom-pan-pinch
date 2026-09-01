# #498 — Pinch props have no effect on touchpad pinch gestures

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/498
- **Reported by:** @rrkoshta123
- **Created:** 2024-08-09
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Pinch-related props (`pinch.step`, `pinch.disabled`, `onPinching`) have no effect on touchpad pinch gestures. The touchpad pinch events may be routed through the wheel handler instead.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **By design (documented).** Documented behaviour, not a bug: a touchpad pinch reaches the browser as ctrl+wheel and is handled by the wheel path, so `wheel.touchPadDisabled` / `wheel.step` apply and `pinch.*` / `onPinch*` do not. The previous spec asserted an unrelated callback. Recommend closing with a docs note. |

## Regression spec

- [`__tests__/regressions/pinch-interaction.spec.tsx`](../../__tests__/regressions/pinch-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
