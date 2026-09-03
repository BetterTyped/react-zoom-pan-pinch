# #357 — Placing elements on top of each other, and window resizing problem.

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/357
- **Reported by:** @strokine
- **Created:** 2023-03-13
- **Deduped issues:** none
- **Area:** bounds

## Summary

When using absolute positioning to stack elements inside `TransformComponent`, window resizing causes layout problems. Request for better resize handling that preserves the spatial relationship of positioned children.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-09-02 | Bounds now follow size changes: one `ResizeObserver` watches the wrapper and the content for the lifetime of the instance, recalculates the bounds and animates the transform back inside them (`autoAlignment.animationTime`/`animationType`) whenever either element changes size — children re-rendering with another size, images loading, the viewport resizing. The alignment takes effect immediately: a move in flight (inertia, alignment, programmatic) is cancelled and a trackpad sequence continues against the fresh bounds. Only a held pointer (mouse/touch drag, pinch) keeps its bounds until release — replacing them mid-drag would make the next move jump — and the release alignment then uses the fresh bounds; an animation restoring the scale range finishes first. The alignment is a per-frame exponential ease towards the *current* bounds (re-read every frame), so a CSS height transition is followed smoothly with no catch-up burst, a one-off step settles within `autoAlignment.animationTime`, and it stops if the content grows back into bounds. Verified in headless Chrome on the `Basic/Rerendering` story (2026-09-03), whose block reflows are now height-animated. Covered by [`__tests__/features/content-resize/content-resize.spec.tsx`](../../__tests__/features/content-resize/content-resize.spec.tsx) and [`__tests__/units/resize.spec.ts`](../../__tests__/units/resize.spec.ts). |

## Rating (2026-09-01)

**#357 — Close: no repro**

- **Action:** Close: no reproduction, no activity since 2023.
- **Why:** Vague layout question about absolutely-positioned children.
