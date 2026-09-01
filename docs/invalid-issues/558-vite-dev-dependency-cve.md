# #558 — Vulnerability in react-zoom-pan-pinch project (vite)

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/558
- **Category:** not-applicable

## Reason

A scanner flagged the `vite` devDependency (5.0.11) for a dev-server path
traversal CVE. `vite` only powers the local Storybook; it is not a runtime or
peer dependency and nothing from it is published in the package, so consumers
are unaffected. Dependabot PR #571 bumps it to 6.4.3 and can be merged as
housekeeping.

## Rating (2026-09-01)

**#558 — Close: not worth**

- **Action:** Close: `vite` is a devDependency for Storybook only and is not shipped in the package. Merge dependabot PR #571 (vite 6.4.3) as housekeeping.
- **Why:** Dev-server path-traversal CVE has no effect on consumers.
