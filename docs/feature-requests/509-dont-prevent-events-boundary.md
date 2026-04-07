# #509 — Don't prevent events for panning when image has reached the boundary

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/509
- **Reported by:** @Frrede
- **Created:** 2024-09-27
- **Deduped issues:** none
- **Area:** pan

## Summary

Request to stop calling `preventDefault` on pan events when the content has reached its boundary. This would let parent scrollable containers take over naturally when the user pans past the edge.

## Status log

| Date | Entry |
|------|-------|
| — | _open_ |
