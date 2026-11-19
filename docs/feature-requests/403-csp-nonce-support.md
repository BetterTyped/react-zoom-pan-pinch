# #403 — CSP/Nonce Support?

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/403
- **Reported by:** @rmincling
- **Created:** 2023-08-04
- **Deduped issues:** none
- **Area:** styling

## Summary

Request for Content Security Policy nonce support on injected `<style>` tags. Required for apps with strict CSP headers that block inline styles without a valid nonce attribute.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |
| 2026-11-19 | **Built on master (unreleased).** rollup-plugin-postcss runs with `inject: false`, so the bundle no longer appends a `<style>` at import. `TransformComponent` injects the exported `stylesheet` into the wrapper's root at mount (once per root), with a `nonce` prop; `disableStyleInjection` skips it and `dist/styles.css` (emitted by `scripts/stylesheet-asset.cjs`) can be loaded instead. ADR: `docs/adr/0002-stylesheet-delivery.md`. Specs: `__tests__/regressions/style-injection.spec.tsx`, `__tests__/regressions/build-packaging.spec.ts`. |

## Rating (2026-09-01)

**#403 — Discuss** · priority medium · cluster `styles-delivery`

- **Action:** Strict CSP blocks the runtime-injected `<style>` from rollup-plugin-postcss. Options: ship `dist/styles.css` and let consumers import it, or move the handful of critical rules inline. Decide together with #371.
- **Why:** Shares a fix with the shadow-DOM cluster.
