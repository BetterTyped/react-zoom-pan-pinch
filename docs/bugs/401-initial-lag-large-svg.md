# #401 — Large SVG content causes initial render lag

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/401
- **Reported by:** @umeeridrees
- **Created:** 2023-07-22
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** animation

## Summary

Large SVG content (~5MB+) causes significant lag on initial render and first interaction. The library applies transforms before the browser has finished layout, causing jank.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: paint performance with large SVG; no code change. |

## Regression spec

- N/A — performance, not a correctness assertion.

## Rating (2026-09-01)

**#401 — Close: not worth** · cluster `render-performance`

- **Action:** Close with a link to a short performance guide (Virtualize component, `will-change` trade-offs, rasterising huge SVGs to tiles). No library change.
- **Why:** Paint cost of multi-megabyte SVG is a browser limit; the v4 `Virtualize` component and the Miro/stress examples are the answer.
