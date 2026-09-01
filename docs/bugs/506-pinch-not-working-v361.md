# #506 — Pinch zoom broken in v3.6.1+ — whole page zooms

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/506
- **Reported by:** @ifancyabroad
- **Created:** 2024-09-17
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pinch

## Summary

Pinch zoom stopped working entirely in v3.6.1+. Instead of zooming the element, the entire page zooms. The `touch-action` CSS or `preventDefault` handling regressed. Works correctly in v3.5.1.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: the wrapper does not set `touch-action`; touch events are cancelled from a non-passive listener while pinching. Page-level pinch zoom needs a device pass; no code change. |

## Regression spec

- N/A — needs device testing.

## Rating (2026-09-01)

**#506 — Close: fixed**

- **Action:** Close as fixed: reporters confirm 3.7.0 fixed it (2025-02, 2025-05) and v4 carries the fix.
- **Why:** Multiple confirmations in the thread; nothing left to verify.
