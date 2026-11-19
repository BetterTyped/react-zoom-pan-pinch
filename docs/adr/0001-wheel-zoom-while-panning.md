# 0001 — Wheel zoom works while a mouse pan is held

- **Date:** 2026-11-19
- **Status:** accepted
- **Issues:** #543

## Context

`isWheelAllowed` returned false while `isPanning`, so the wheel did nothing
during a drag. Map and canvas tools (Figma, Miro, map viewers) let you zoom
with the wheel while dragging, and #543 asked for it. The pan maps the pointer
to a position through `startCoords`, taken at the scale the drag started with,
so a zoom mid-drag made the next pointer move snap the content back.

## Decision

Wheel zoom is allowed during a mouse pan, by default. After each wheel zoom
during a pan:

- `startCoords` is re-anchored at the zoomed state (`handlePanningSetup` with
  the wheel event's pointer), so the drag continues from where the content is;
- the velocity sample is dropped, so the jump is not read as a fling;
- the scale is clamped to `minScale`/`maxScale` (no `zoomAnimation.size`
  overshoot, even for a trackpad pinch), and the delayed settle animation is
  skipped — the pan end aligns instead.

Trackpad (wheel) panning stays blocked during a drag: the drag owns the
position.

## Consequences

- Visible default change for anyone who relied on the wheel being ignored
  mid-drag. Call it out in the release notes.
- No option to turn it off. Add one only if someone asks
  (`.cursor/rules/module-design.mdc`: every prop is forever).
