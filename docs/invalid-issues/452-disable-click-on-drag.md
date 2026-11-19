# #452 — How to disable the click event when drag & drop

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/452
- **Category:** question

## Reason

The user is asking how to differentiate between a click and a drag gesture. This is a common UX pattern solvable in application code by tracking pointer movement distance between pointerdown and pointerup. It is not a library bug or missing feature.

## Status log

| Date | Entry |
|------|-------|
| 2026-11-19 | **Built on master (unreleased).** New `panning.suppressClickAfterPan` (on by default; maintainer decision in the 2026-11-19 triage): a mouse pan that moved the pointer more than 5px swallows the click right after it, via a one-shot capture listener on the window, limited to clicks inside the wrapper. Covers #519. Spec: `__tests__/features/pan/pan.click-after-pan.spec.tsx`. |

## Rating (2026-09-01)

**#452 — Discuss** · priority low · cluster `click-vs-drag`

- **Action:** Decide whether to expose a drag-vs-click signal (e.g. `instance.isPanning` in `onClick`, or a `panning.clickThreshold`). A docs recipe may be enough. Covers #519.
- **Why:** Two threads ask the same thing.
