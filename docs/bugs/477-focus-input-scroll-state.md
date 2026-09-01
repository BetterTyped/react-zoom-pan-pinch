# #477 — Input focus scroll desynchronizes transform state

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/477
- **Reported by:** @ducle-infotrack
- **Created:** 2024-05-22
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Focusing an input inside TransformComponent causes the browser to scroll the content to show the cursor, but this scroll is not captured by the library. The transform state becomes desynchronized from the visual position.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: focus-driven scroll needs a browser; no code change. |

## Regression spec

- N/A — needs browser testing.

## Rating (2026-09-01)

**#477 — Close: dupe** · duplicate of #280 · cluster `focus-scroll`

- **Action:** Close as duplicate of #280 (same fix).
- **Why:** Same mechanism: browser scrolls the hidden-overflow wrapper on focus.
