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
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — focus scrollIntoView behavior; requires browser testing.
