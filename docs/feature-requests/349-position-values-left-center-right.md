# #349 — Allow to use `'left' | 'center' | 'right'` and `'top' | 'center' | 'bottom'` for the position values

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/349
- **Reported by:** @vimutti77
- **Created:** 2023-03-01
- **Deduped issues:** none
- **Area:** api

## Summary

Request to accept semantic position values like `'left' | 'center' | 'right'` and `'top' | 'center' | 'bottom'` for `initialPositionX`/`initialPositionY` instead of requiring raw pixel numbers.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Built on master (unreleased).** `initialPositionX` accepts `'left' | 'center' | 'right'`, `initialPositionY` `'top' | 'center' | 'bottom'`, resolved once both boxes have a size (`applyNamedInitialPosition`); a named axis wins over `centerOnInit`/`fitOnInit` on that axis and `resetTransform` returns to it. `setTransform` is unchanged. Spec: `__tests__/features/positions/positions.named.spec.tsx`. |

## Rating (2026-09-01)

**#349 — Discuss** · priority low

- **Action:** Decide whether `initialPositionX/Y` should accept `'left' | 'center' | 'right'` / `'top' | 'center' | 'bottom'`. `centerOnInit` already covers the common case.
- **Why:** Nice-to-have sugar; small.
