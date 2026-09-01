# #437 — contenteditable and inputs not editable inside TransformComponent

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/437
- **Reported by:** @vivekcontentstack
- **Created:** 2023-11-21
- **Reported-against version:** _unverified_
- **Deduped issues:** #544
- **Area:** pan

## Summary

Text inputs, textareas, and elements with `contenteditable="true"` inside `TransformComponent` cannot be edited. Pan event handlers intercept pointer/touch events before the input elements can process them. The `excluded` class workaround is not documented for this use case.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Fixed on master.** Fixed: `input`, `textarea`, `select` and anything nested inside a `contenteditable` region no longer start a pan or cancel `mousedown` / `touchstart`, and double-click on them does not zoom (`isEditableTarget` in `src/utils/helpers.utils.ts`). The `panning.excluded` workaround keeps working. Dupe #544. |

## Regression spec

- [`__tests__/regressions/editable-targets.spec.tsx`](../../__tests__/regressions/editable-targets.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
- [`__tests__/regressions/pan-interaction.spec.tsx`](../../__tests__/regressions/pan-interaction.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
