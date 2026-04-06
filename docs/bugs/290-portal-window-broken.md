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
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
