# #283 — zoomToElement calculates incorrect position and scale

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/283
- **Reported by:** @sikandarchishty
- **Created:** 2022-02-22
- **Reported-against version:** _unverified_
- **Deduped issues:** #343, #540
- **Area:** zoom

## Summary

`zoomToElement` calculates incorrect target position and scale, especially in wide containers. The element doesn't center in viewport as expected. #540 reports the Storybook example page crashes entirely when using this feature.

## Resolution log

| Date | Entry |
|------|-------|
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/component-lifecycle.spec.tsx`** — **Failing** on v4 (confirmed bug).
