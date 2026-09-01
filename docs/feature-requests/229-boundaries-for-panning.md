# #229 — Boundaries for panning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/229
- **Reported by:** @jpbast
- **Created:** 2021-08-12
- **Deduped issues:** none
- **Area:** bounds

## Summary

Request for configurable panning boundaries independent of content size. Users want to define a custom rectangular region that limits how far content can be panned, similar to Flipp.com's constrained image navigation.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#229 — Close: shipped**

- **Action:** Close: `minPositionX/maxPositionX/minPositionY/maxPositionY` are respected since the #250/#478 fix. Mention PR #541 (`maxBounds`) only if a stricter mode is wanted.
- **Why:** Custom pan boundaries exist.
