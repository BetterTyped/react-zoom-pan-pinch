# #467 — Text selection and copy broken inside TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/467
- **Reported by:** @rkvirajgupta
- **Created:** 2024-03-28
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Text selection and copy (Ctrl+C / Cmd+C) does not work on content inside TransformComponent. The mousedown/mousemove handlers for panning prevent the browser's native text selection.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Open.** Still open: `.wrapper { user-select: none }` is what blocks selection and copy. The previous spec listed that rule as the fix for this issue; it is now a plain CSS-contract pin. A fix would scope `user-select: none` to active gestures only. |
| 2026-09-02 | **Fixed on master.** The stylesheet no longer sets `user-select: none`; the wrapper gets an inline `user-select: none` only while a pan gesture is active (mouse or touch) and the previous inline value is restored afterwards. `panning.disabled` also stops the mousedown from being claimed, so selection works natively there. Spec: `__tests__/regressions/text-selection.spec.tsx`. |

## Regression spec

- N/A — no regression test until the CSS is gesture-scoped.

## Rating (2026-09-01)

**#467 — Fix** · priority medium

- **Action:** Scope `user-select: none` to an active gesture (toggle a class while `isPanning`/pinching), or add a `panning.allowTextSelection` prop. Until then answer with the `text-selection` story pattern (`panning.excluded` + `userSelect: text`).
- **Why:** Still the only bug marked Open in the September verification pass. The `text-selection` Storybook example already shows the userland workaround, so this is small.
