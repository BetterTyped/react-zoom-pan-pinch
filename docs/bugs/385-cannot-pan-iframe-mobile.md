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
| 2026-09-01 | **Not testable in Jest.** Reviewed: iframe touch capture on mobile needs a real device; no code change. Dupe #528. |

## Regression spec

- N/A — needs device testing.
