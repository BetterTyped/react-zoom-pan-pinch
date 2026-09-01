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

## Rating (2026-09-01)

**#421 — Discuss** · priority low

- **Action:** Decide whether a `wheel.reversed` flag is worth the API surface. Implementation is one sign flip in `getDelta`.
- **Why:** Two reactions.
