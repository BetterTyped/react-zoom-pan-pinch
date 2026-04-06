# #553 — Ref object has inconsistent structure

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/553
- **Reported by:** @MagdalenaMajchrzak
- **Created:** 2026-02-06
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** controls

## Summary

The ref object returned by TransformWrapper has inconsistent structure: sometimes `ref.current.state` exists, sometimes only `ref.current.instance.transformState`. The shape depends on render timing and causes TypeScript errors.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/programmatic-api-callbacks.spec.tsx`** — **Failing** on v4 (confirmed bug).
