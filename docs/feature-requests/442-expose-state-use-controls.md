# #442 — Expose state variables in useControls hook and on transformWrapper ref object

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/442
- **Reported by:** @Andrii-Vovk
- **Created:** 2023-12-28
- **Deduped issues:** none
- **Area:** api

## Summary

Request to expose `scale`, `positionX`, and `positionY` state values from the `useControls` hook and on the `TransformWrapper` ref, so consumers can read current transform state without tracking it separately.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#442 — Close: shipped**

- **Action:** Close: `useControls()` returns `instance` and `state`; for reactive reads use `useTransformEffect`/`useTransformContext`; the ref exposes `instance.state`.
- **Why:** Shipped; the docs answer is `useTransformEffect`.
