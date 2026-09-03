# #290 — Interactions break inside portal windows

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/290
- **Reported by:** @p-foucht
- **Created:** 2022-03-23
- **Reported-against version:** _unverified_
- **Deduped issues:** #537
- **Area:** pan

## Summary

Panning and other interactions break when the component is rendered inside a portal window (`window.open` + `React.createPortal`) on Chrome/Mac. The library's event listeners reference the wrong `document`/`window` context.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Partially addressed.** Partially addressed: `zoomToElement(id)` now resolves ids in the wrapper's `ownerDocument` and the MiniMap listens on its own document; window/document listeners were already attached to the wrapper's window. A real portal-window pass is not possible in jsdom. Dupe #537. |
| 2026-09-02 | **Fixed on master.** `isPanningStartAllowed` walks `composedPath()` with a duck-typed element check and `handlePanningStart` detects touch events by shape, so nodes and events from another window (portal, popup, iframe) are accepted (the change proposed in PR #552). Spec: `__tests__/regressions/portal-window.spec.tsx` renders into an iframe realm and pans with mouse and touch. Dupe #537. |

## Regression spec

- N/A — multi-document window.open cannot be reproduced in jsdom.

## Rating (2026-09-01)

**#290 — Fix** · priority medium · cluster `portal-window`

- **Action:** Review and merge PR #552 (panning in additional window) with a spec; then close #290 and #537.
- **Why:** Partially addressed on master (ids resolve in `ownerDocument`, MiniMap listens on its own document). PR #552 by @qsavoye targets the remaining window-listener gap.

**#537 — Close: dupe** · duplicate of #290 · cluster `portal-window`

- **Action:** Close as duplicate of #290 once PR #552 lands.
- **Why:** Same portal/external-window scenario.
