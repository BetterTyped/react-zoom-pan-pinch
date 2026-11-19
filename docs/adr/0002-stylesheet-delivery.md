# 0002 — The stylesheet is injected per root at mount, not at import

- **Date:** 2026-11-19
- **Status:** accepted
- **Issues:** #403 (CSP), #371 / #444 (shadow DOM)

## Context

rollup-plugin-postcss bundled `style-inject`, which appends a `<style>` to
`document.head` the moment the module is imported. That breaks two setups:

- a Content Security Policy without `'unsafe-inline'` blocks the tag, and
  there was no way to give it a nonce;
- inside a shadow root, styles in the document head never apply, so the
  wrapper lost `overflow: hidden`, its sizing and the `img` pointer-events
  rule (`transform-origin` was already inlined for #371).

Inlining every rule was rejected: inline styles beat user CSS on specificity,
so class-based overrides would stop working, and `.content img` cannot be
inline at all.

## Decision

- postcss runs with `inject: false`; the CSS string is exported as
  `stylesheet` and `scripts/stylesheet-asset.cjs` also writes it to
  `dist/styles.css`.
- `TransformComponent` calls `injectStylesheet` in its layout effect, before
  `init` measures anything: one `<style data-react-zoom-pan-pinch>` per root
  (document head, or the shadow root the wrapper is in), appended like
  style-inject did, deduplicated by content so two copies of the library both
  get their own.
- New `TransformComponent` props: `nonce` (set on the `<style>`) and
  `disableStyleInjection` (inject nothing; the app loads
  `react-zoom-pan-pinch/dist/styles.css`).

## Consequences

- The styles now arrive at mount instead of at import. Both happen before the
  first paint of the viewer, and on the server neither ran, so SSR output is
  unchanged.
- Bundlers that load the CSS module themselves (Storybook's webpack) export
  no `stylesheet`; the injector then does nothing and their own loader
  applies the CSS.
- Jest's CSS mock has no `stylesheet` either: component specs that need it
  mock the module (`__tests__/regressions/style-injection.spec.tsx`).
