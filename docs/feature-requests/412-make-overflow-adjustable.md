# #412 — Make overflow adjustable

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/412
- **Reported by:** @c0ntradicti0n
- **Created:** 2023-08-29
- **Deduped issues:** none
- **Area:** styling

## Summary

Request to make the CSS `overflow` property on the wrapper and content containers configurable via props, instead of being hardcoded to `hidden`. Some layouts need `visible` or `auto` overflow.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#412 — Close: shipped**

- **Action:** Close: `wrapperStyle={{ overflow: 'visible' }}` / `contentStyle` on `TransformComponent`.
- **Why:** Shipped.
