# #421 — Reverse Zoom Behavior?

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/421
- **Reported by:** @afgarcia86
- **Created:** 2023-09-19
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for an option to reverse the zoom direction (scroll up = zoom out, scroll down = zoom in), matching "natural scroll" conventions on some platforms and user preferences.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Close: won't fix** (2026-11-19 triage). Wheel up already zooms in (`getDeltaY`: `deltaY < 0 → +1`); the report most likely comes from OS natural scrolling, which inverts every app. No `wheel.reversed` flag. |
| 2026-11-19 | **Closed on GitHub** (not planned) with the comment drafted in the 2026-11-19 triage. |

## Rating (2026-09-01)

**#421 — Discuss** · priority low

- **Action:** Decide whether a `wheel.reversed` flag is worth the API surface. Implementation is one sign flip in `getDelta`.
- **Why:** Two reactions.
