# #366 — Controlling zoom state via shared state

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/366
- **Reported by:** @
- **Created:** 2023-04-06
- **Deduped issues:** none
- **Area:** api

## Summary

Request to control zoom/pan state from external React state (e.g. a slider or input field). Users want bidirectional binding between the library's internal transform state and their own state management.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#366 — Discuss** · priority high

- **Action:** Controlled-component mode (`scale`/`positionX`/`positionY` + `onChange`) is a real architectural change. Decide whether v4 wants it or whether `setTransform` + `useTransformEffect` is the supported two-way pattern.
- **Why:** Large; touches the core state loop.
