# #329 — Add hook to allow zoom-pan-pinch without predefined components

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/329
- **Reported by:** @prc5
- **Created:** 2023-01-17
- **Deduped issues:** none
- **Area:** api

## Summary

Request for a hook-based API that provides zoom/pan/pinch behavior without requiring `TransformWrapper` and `TransformComponent`. Users want to attach transform behavior to arbitrary elements, `<canvas>`, or non-DOM targets.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-01 | **Shipped on master.** `useZoomPanPinch` is exported from the package and documented in the Storybook (Hooks/useZoomPanPinch). Spec: `__tests__/features/hooks/hooks.spec.tsx`. |

## Rating (2026-09-01)

**#329 — Build** · priority medium

- **Action:** `useZoomPanPinch` exists in src/hooks and is covered by hooks.spec, but it is not exported from the package. Sign off on the API (`wrapperRef`, `contentRef`, `instance`, `useTransform`), export it from `src/hooks/index.ts` and document it.
- **Why:** Ninety percent done; only the export and docs are missing.
