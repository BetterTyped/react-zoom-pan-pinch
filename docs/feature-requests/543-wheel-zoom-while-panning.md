# #543 — Zoom with scroll wheel while panning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/543
- **Reported by:** @hach-que
- **Created:** 2025-07-17
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request to allow scroll-wheel zoom while the user is actively panning (holding mouse button down). Currently wheel events during a pan gesture are silently ignored.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Built on master (unreleased).** Wheel zoom now works during a mouse pan (on by default; maintainer decision in the 2026-11-19 triage). `handleWheelZoom` re-anchors `startCoords` at the zoomed state and drops the velocity sample, clamps the scale to min/max (no overshoot mid-drag), and the settle animation is skipped while the pointer owns the position; trackpad panning stays blocked mid-drag. ADR: `docs/adr/0001-wheel-zoom-while-panning.md`. Spec: `__tests__/features/zoom/zoom.wheel-while-pan.spec.tsx`. |

## Rating (2026-09-01)

**#543 — Discuss** · priority low

- **Action:** `isWheelAllowed` deliberately returns false while `isPanning`. Enabling wheel zoom mid-drag changes the pan anchor maths. Lean close unless a use case appears.
- **Why:** No reactions.
