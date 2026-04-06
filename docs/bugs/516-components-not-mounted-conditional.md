# #516 — "Components are not mounted" with conditional rendering

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/516
- **Reported by:** @mhryshkin
- **Created:** 2024-11-18
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

If `TransformComponent` is rendered conditionally (delayed or inside a lazy-loaded subtree), the library throws "Components are not mounted". The component registration doesn't handle async mounting.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

_Pending_
