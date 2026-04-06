# #316 — Panning stops responding at boundary conditions

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/316
- **Reported by:** @NelsonKllc
- **Created:** 2022-11-04
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

Panning stops responding after reaching certain boundary conditions. User must scroll the page to "unstick" the component. Likely related to bounds calculation or event listener cleanup.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/bounds-centering.spec.tsx`** — **FAILING**. Asserts panning stays stuck after hitting bounds: reversing pan direction does not update position.
