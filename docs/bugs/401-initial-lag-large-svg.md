# #401 — Large SVG content causes initial render lag

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/401
- **Reported by:** @umeeridrees
- **Created:** 2023-07-22
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Large SVG content (~5MB+) causes significant lag on initial render and first interaction. The library applies transforms before the browser has finished layout, causing jank.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
