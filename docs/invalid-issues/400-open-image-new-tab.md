# #400 — Open Image in new tab not working

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/400
- **Category:** insufficient-info

## Reason

The user reports that right-click "Open image in new tab" does not work. This is expected behavior when pointer event listeners are attached to the image wrapper, as the browser's context menu target changes. This is not a library bug — it is inherent to wrapping images in interactive containers. No repro or version info was provided.
