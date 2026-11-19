# #500 — Customize the wheelPanning behaviour.

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/500
- **Reported by:** @0x0wen
- **Created:** 2024-08-13
- **Deduped issues:** none
- **Area:** pan

## Summary

Request for customizable trackpad/wheel panning behavior: sensitivity adjustment, axis locking, and speed control for wheel-driven pan. Gives developers fine-grained tuning of the scroll-to-pan experience.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Built on master (unreleased).** `trackPadPanning.speed` (multiplier, default 1). Wheel-pan deltas are also normalised: `deltaMode` lines → 16px, pages → wrapper size, and Shift turns a vertical wheel horizontal when the browser did not already report it as `deltaX`. Spec: `__tests__/features/props/trackpad-panning-props.spec.tsx`. |

## Rating (2026-09-01)

**#500 — Discuss** · priority low · cluster `wheel-to-pan`

- **Action:** Decide whether `trackPadPanning` needs a `sensitivity`/`speed` option. Axis lock, velocity and activation keys already exist. PR #518 (shift key → horizontal wheel pan) is in the same area.
- **Why:** Partially shipped; only speed tuning is missing.
