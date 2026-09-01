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

## Rating (2026-09-01)

**#403 — Discuss** · priority medium · cluster `styles-delivery`

- **Action:** Strict CSP blocks the runtime-injected `<style>` from rollup-plugin-postcss. Options: ship `dist/styles.css` and let consumers import it, or move the handful of critical rules inline. Decide together with #371.
- **Why:** Shares a fix with the shadow-DOM cluster.
