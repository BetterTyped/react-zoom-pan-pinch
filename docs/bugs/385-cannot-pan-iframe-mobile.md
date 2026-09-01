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

## Rating (2026-09-01)

**#385 — Discuss** · priority medium · cluster `iframe-children`

- **Action:** Pick one: (a) document the overlay workaround (`pointer-events: none` on the iframe while a gesture is active, or a transparent capture layer), or (b) ship a `TransformIFrameComponent` as asked in the #348 thread. Cannot be fixed inside the core: events inside an iframe never reach the parent document.
- **Why:** Three reporters across #385/#528 plus a roadmap comment. Needs a product decision, not a bug fix.

**#528 — Close: dupe** · duplicate of #385 · cluster `iframe-children`

- **Action:** Close as duplicate of #385.
- **Why:** Same iframe-child limitation (pinch instead of pan).
