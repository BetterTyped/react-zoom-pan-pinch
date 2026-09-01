# #371 — Support Use Under Shadow DOM

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/371
- **Reported by:** @Olliebrown
- **Created:** 2023-04-29
- **Deduped issues:** none
- **Area:** styling

## Summary

Request for proper Shadow DOM support. The library's styles and event listeners assume document-level access, which breaks when the component tree is rendered inside a Shadow DOM boundary.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Partially addressed on master.** `transform-origin: 0 0` is now inline on the content element (the rule whose absence broke the zoom anchor in shadow roots) and `zoomToElement(id)` resolves ids in the wrapper's root node. Clipping/user-select still come from the stylesheet. Spec: `__tests__/regressions/shadow-dom.spec.tsx`. |

## Rating (2026-09-01)

**#371 — Fix** · priority medium · cluster `styles-delivery`

- **Action:** Inline the critical styles (`transform-origin: 0 0`, `position`, `overflow`, `user-select`) as style attributes, or inject the stylesheet into `wrapperComponent.getRootNode()` when it is a ShadowRoot. Resolve event targets through `composedPath()`. Add a jsdom spec that mounts inside `attachShadow`.
- **Why:** Confirmed still broken by two reporters in 2025-06 and 2026-05: CSS-module classes never reach the shadow root, so `transform-origin` falls back to center and zoom anchors at the bottom-right. Same root cause as #444 and shares a delivery story with #403 (CSP).
