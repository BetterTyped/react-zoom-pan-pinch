# #430 — Scrollbar thumb jumps to unexpected position on zoom

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/430
- **Reported by:** @
- **Created:** 2023-10-20
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** zoom

## Summary

When zooming, the browser's native scrollbar thumb jumps to an unexpected position. The transform doesn't update scroll position metadata, confusing the browser's scroll state.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: native scrollbar behaviour; no code change. |

## Regression spec

- N/A — needs browser testing.

## Rating (2026-09-01)

**#430 — Close: not worth** · duplicate of #454 · cluster `native-scrollbars`

- **Action:** Close; point to #454 for the scrollbar discussion.
- **Why:** The library never drives native scroll, so scrollbar thumbs are the host page's. Folded into the scrollbars cluster.
