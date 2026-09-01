# #444 — Styles not applied inside Shadow DOM

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/444
- **Reported by:** @rupeshvitekar
- **Created:** 2024-01-09
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

When the component is rendered inside a Shadow DOM, the library's injected styles (via `<style>` tags) are not applied because they target the document root, not the shadow root.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: styles are CSS-module classes on the rendered elements, no injected `<style>`; Shadow DOM verification needs a browser. No code change. |

## Regression spec

- N/A — needs browser testing.

## Rating (2026-09-01)

**#444 — Close: dupe** · duplicate of #371 · cluster `styles-delivery`

- **Action:** Close as duplicate of #371.
- **Why:** Identical root cause (CSS-module classes not applied inside a shadow root).
