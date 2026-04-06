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
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
