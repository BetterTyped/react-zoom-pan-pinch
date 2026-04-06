# #313 — Duplicating browser tab causes CSS rendering artifacts

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/313
- **Reported by:** @akshaykumarappu
- **Created:** 2022-10-06
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

Duplicating a browser tab that has an active transform state causes CSS rendering artifacts. The duplicated tab inherits the transform style but not the internal state.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **N/A** — browser tab duplication; not reproducible in jsdom.
