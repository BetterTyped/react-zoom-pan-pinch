# #377 — limit the panning to the size of the image, not the screen.

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/377
- **Reported by:** @doodguymandood
- **Created:** 2023-05-17
- **Deduped issues:** none
- **Area:** bounds

## Summary

Request to limit panning so the viewport never scrolls beyond the actual content/image boundaries. Currently bounds are tied to the screen/container, which can leave empty space visible.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#377 — Close: no repro**

- **Action:** Close: bounds are derived from the content size with `limitToBounds`; ask for a repro if it recurs.
- **Why:** Likely resolved by the v4 bounds fixes (#250/#396).
