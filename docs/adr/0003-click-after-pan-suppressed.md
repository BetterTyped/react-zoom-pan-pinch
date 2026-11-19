# 0003 — The click after a mouse drag is swallowed by default

- **Date:** 2026-11-19
- **Status:** accepted
- **Issues:** #452, #519

## Context

Browsers fire `click` after `mousedown` + `mouseup` on the same element,
however far the pointer travelled. Dragging a canvas with clickable content
(seat maps, markers, buttons) therefore also clicked whatever the drag
started on. Users worked around it with timers (`mouseup − mousedown >
250 ms`), which misfire on slow clicks and quick drags. d3-zoom and Leaflet
suppress the click after a drag by default.

## Decision

New `panning.suppressClickAfterPan`, **on by default**. When a mouse pan
ended with `mouseup` and the pointer moved more than `CLICK_DISTANCE` (5px,
the same threshold that already separates a click from a fling in
`handlePanningEnd`), a one-shot capture listener on the window swallows the
next `click` inside the wrapper (`stopPropagation` + `preventDefault`) and
removes itself on the next tick if no click came.

- Measured on pointer travel, not content movement: a drag against the bounds
  is still a drag.
- Mouse only. After a touch pan the browser does not fire a click.
- A pan handed back by `releaseAtBounds`, or cancelled by `mouseleave`, does
  not suppress anything.

## Consequences

- Default change: code that wanted the click after a drag must set
  `panning={{ suppressClickAfterPan: false }}`. Release notes.
- The window capture listener runs before React's root listeners, so both
  `onClick` and `onClickCapture` inside the content are suppressed.
