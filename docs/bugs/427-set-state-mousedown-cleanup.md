# #427 — Parent setState breaks mousedown listener

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/427
- **Reported by:** @lesjames
- **Created:** 2023-10-16
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Calling `setState` in a parent component above `TransformWrapper` causes the mousedown listener to be cleaned up. Subsequent pan gestures fail because the component re-mounts and loses event binding.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
