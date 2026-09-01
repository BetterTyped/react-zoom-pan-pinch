# #462 — Content centering incorrect in certain CSS layouts

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/462
- **Reported by:** @AaronNGray
- **Created:** 2024-03-19
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

Content centering is incorrect in certain CSS layout contexts (e.g., fixed-width containers with margins). The centering calculation doesn't account for the wrapper's offset within the page.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Verified fixed.** Verified on master: `centerView` centres within the wrapper and the wrapper's page offset does not leak into the transform. |

## Regression spec

- [`__tests__/regressions/bounds-centering.spec.tsx`](../../__tests__/regressions/bounds-centering.spec.tsx) — passing on master (2026-09-01); asserts the reported failure mode, not just that the code runs.
