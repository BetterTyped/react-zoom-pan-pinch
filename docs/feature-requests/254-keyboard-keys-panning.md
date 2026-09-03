# #254 — Use keyboard keys for panning

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/254
- **Reported by:** @ldai1
- **Created:** 2021-11-06
- **Deduped issues:** none
- **Area:** pan

## Summary

Request to support keyboard arrow keys for panning the viewport after zooming in. Currently there is no built-in keyboard-driven pan support, forcing users to rely on mouse or touch input exclusively.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-02 | **Shipped on master.** Opt-in `keyboard` prop (`disabled`, `panStep`, `zoomStep`, `animationTime`, `animationType`, `excluded`): arrows pan, `+`/`-` zoom, `0` resets; the wrapper becomes focusable (`tabIndex` 0 unless `wrapperProps` sets one); modifier combos and editable targets are ignored. New `panBy(dx, dy, animationTime?, animationType?)` control for directional buttons (#527). Specs: `__tests__/features/keyboard/keyboard.spec.tsx`, `__tests__/features/controls/controls.pan-by.spec.tsx`. |
| 2026-09-02 | Follow-up: a pan start cancels the mousedown, which also cancels focus, so the wrapper now focuses itself when keyboard mode is on; handled keys stop propagation so host shortcuts (Storybook) do not fire. Storybook example: Basic/Keyboard Navigation. |

## Rating (2026-09-01)

**#254 — Build** · priority medium · cluster `keyboard-a11y`

- **Action:** Roadmap item 5. Add `keyboard={{ disabled, panStep, zoomStep }}` on the wrapper (arrows pan, +/- zoom, 0 reset) and a public `panBy(dx, dy)` control that #527 can use for buttons.
- **Why:** No keyboard navigation exists in core (only modifier tracking). Accessibility win.
