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
| 2026-09-01 | **Not testable in Jest.** Reviewed: browser tab duplication; no code change. |

## Regression spec

- N/A — not reproducible in jsdom.

## Rating (2026-09-01)

**#313 — Close: no repro**

- **Action:** Close: not reproducible, no follow-up since 2022.
- **Why:** Tab duplication restores DOM without library state; no repro ever supplied.
