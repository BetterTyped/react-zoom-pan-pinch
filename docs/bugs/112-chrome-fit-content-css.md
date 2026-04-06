# #112 — fit-content CSS causes Chrome misrender

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/112
- **Reported by:** @dpdoughe
- **Created:** 2020-05-15
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

The `fit-content` CSS value on TransformComponent's wrapper causes Chrome to misrender (oversized container). Firefox ignores the unsupported value and renders correctly. Setting width/height to `unset` fixes it.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
