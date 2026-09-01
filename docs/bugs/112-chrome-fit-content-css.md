# #112 — fit-content CSS causes Chrome misrender

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/112
- **Reported by:** @dpdoughe
- **Created:** 2020-05-15
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** css

## Summary

The `fit-content` CSS value on TransformComponent's wrapper causes Chrome to misrender (oversized container). Firefox ignores the unsupported value and renders correctly. Setting width/height to `unset` fixes it.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Cannot reproduce.** Could not reproduce on a current Chrome: unprefixed `fit-content` has been supported since Chrome 46 and the wrapper intentionally sizes itself to its content (override via `wrapperStyle`). The previous spec asserted the *presence* of the rule under this issue number; it is now a plain CSS-contract test without an issue link. Recommend closing as cannot reproduce. |

## Regression spec

- N/A — `__tests__/regressions/css-and-styles.spec.tsx` pins the stylesheet contract but is not a fix for this issue.
