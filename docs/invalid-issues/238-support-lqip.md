# #238 — Feature request: support of LQIP

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/238
- **Category:** question

## Reason

LQIP (Low Quality Image Placeholders) is an image optimization pattern handled at the application or image-loading layer, not within a zoom/pan/pinch library. The library is content-agnostic and renders whatever children it receives, so LQIP can be implemented entirely in userland without library changes.
