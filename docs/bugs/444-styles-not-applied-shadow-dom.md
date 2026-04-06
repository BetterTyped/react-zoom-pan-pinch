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
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — Shadow DOM style encapsulation; requires browser testing.
