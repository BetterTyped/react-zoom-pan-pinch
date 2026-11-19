# 0004 — Double-click `toggle` is relative to the reset scale

- **Date:** 2026-11-19
- **Status:** accepted
- **Issues:** #125 (and closed PR #548)

## Context

`doubleClick.mode: "toggle"` zoomed in by `step` when the scale was exactly 1
and out by `step` otherwise. With `initialScale` or `fitOnInit` the first
double click zoomed *out*, and after zooming in further with the wheel the
way back only stepped out one `step`. #125 wanted "all the way in / all the
way out"; PR #548 wanted it relative to `initialScale`.

## Decision

`toggle` compares the scale with the reset scale — the scale
`resetTransform` returns to (`getResetScale`: the fitted scale with
`fitOnInit`, otherwise `initialScale` clamped to min/max), within 0.001:

- at the reset scale: zoom in by `step` at the pointer;
- anywhere else: reset (the same as `mode: "reset"`).

This is the photo-viewer behaviour (double tap in, double tap back to fit).
"All the way in" is a large `step`.

## Consequences

- Behaviour change for `toggle` users whose initial scale is not 1, and for
  anyone who zooms past one step before double clicking. Release notes.
- Panning at the reset scale does not count as "away": a double click there
  zooms in rather than recentring.
