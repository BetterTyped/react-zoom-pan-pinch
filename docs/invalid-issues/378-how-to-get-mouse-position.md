# #378 — How to get the mouse position

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/378
- **Category:** question

## Reason

The user is asking how to read mouse coordinates relative to the transformed content. This is a usage question solvable by combining standard DOM mouse events with the current transform state available through the ref API. No library change is needed.

## Rating (2026-09-01)

**#378 — Build** · priority low · cluster `coordinates`

- **Action:** Add one helper, e.g. `instance.clientToContent(clientX, clientY)` returning content-space coordinates, and a docs recipe. Closes #378, #472 and the #297 follow-up.
- **Why:** Three separate threads ask the same conversion.

## Status

2026-09-01: shipped on master as `clientToContent(clientX, clientY)` / `contentToClient(x, y)` on the ref and `useControls()`. Spec: `__tests__/features/controls/controls.zoom-to-point.spec.tsx`.
