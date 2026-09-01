# #460 — Unable to use drag and drop functionality inside of TransformWrapper

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/460
- **Reported by:** @llong
- **Created:** 2024-03-15
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Drag and drop functionality (HTML5 DnD or libraries like react-beautiful-dnd) does not work inside `TransformWrapper`. The library's mousedown/mousemove handlers for panning intercept the drag events before they can reach the DnD system. The `panning.excluded` class can work around this for specific elements, but the interaction between pan gesture detection and drag-start is fundamentally broken for DnD use cases.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed: children of a `draggable` element are excluded from panning as well (previously only the element carrying the attribute), so HTML5 drag sources inside the wrapper keep their native drag (`isDraggableTarget` in `src/utils/helpers.utils.ts`). |

## Regression spec

- [`__tests__/regressions/editable-targets.spec.tsx`](../../__tests__/regressions/editable-targets.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
