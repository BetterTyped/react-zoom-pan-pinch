# #125 — How do I get double click to toggle zoom all-the-way out/all-the-way in

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/125
- **Reported by:** @KevinSince71
- **Created:** 2020-06-18
- **Deduped issues:** none
- **Area:** zoom

## Summary

Request for double-click to toggle between fully zoomed-in and fully zoomed-out states, rather than incrementally zooming in each time. The existing `doubleClick.mode` prop doesn't cover a clean toggle cycle.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#125 — Discuss** · priority low

- **Action:** Decide the semantics of `doubleClick.mode: 'toggle'`: today it zooms in by `step` at scale 1 and out by `step` otherwise. PR #548 wants it relative to `initialScale`; the reporter wanted min↔max. Pick one, then close.
- **Why:** Mostly shipped; the remaining question is what 'toggle' should mean.
