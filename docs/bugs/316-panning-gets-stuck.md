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
| 2026-09-01 | **Verified fixed.** Verified fixed on master: after hitting the bound (0) a reversed pan reaches the opposite bound (-500). |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
