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

## Rating (2026-09-01)

**#543 — Discuss** · priority low

- **Action:** `isWheelAllowed` deliberately returns false while `isPanning`. Enabling wheel zoom mid-drag changes the pan anchor maths. Lean close unless a use case appears.
- **Why:** No reactions.
