# #385 — Panning broken on mobile with iframe children

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/385
- **Reported by:** @NoobRocks
- **Created:** 2023-06-16
- **Reported-against version:** _unverified_
- **Deduped issues:** #528
- **Area:** pan

## Summary

Panning does not work on mobile devices when an iframe is a child of `TransformComponent`. Touch events are captured by the iframe element before the library's handlers can process them.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — iframe touch events on mobile; requires device testing.
