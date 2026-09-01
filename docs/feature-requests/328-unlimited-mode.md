# #328 — Unlimited mode

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/328
- **Reported by:** @prc5
- **Created:** 2023-01-17
- **Deduped issues:** none
- **Area:** bounds

## Summary

Request for a mode with no panning or zooming boundaries, enabling truly infinite canvas applications like graph editors, flowcharts, and collaborative whiteboards.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#328 — Close: shipped**

- **Action:** Close: `limitToBounds={false}` + `<TransformComponent infinite>` + the Miro example is the unlimited mode.
- **Why:** Maintainer's own issue; shipped in v4.
