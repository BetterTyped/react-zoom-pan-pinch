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
| — | _open — not yet investigated_ |

## Regression spec

- **`__tests__/regressions/css-and-styles.spec.tsx`** — **FAILING**. The test was rewritten to read the CSS module source directly (not rely on jsdom-applied styles). It expects **no** `width`/`height: fit-content` on the wrapper; failure means those values are **still** in the published module, matching the reported Chrome misrender risk until the stylesheet is fixed. Real Chrome behavior still benefits from manual check.
