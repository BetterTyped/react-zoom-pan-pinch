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
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
