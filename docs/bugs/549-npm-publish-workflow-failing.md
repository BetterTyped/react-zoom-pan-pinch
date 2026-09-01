# #549 — GitHub Actions npm publish workflow is broken

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/549
- **Reported by:** @softwaresweetsoftware
- **Created:** 2025-11-13
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** build

## Summary

The GitHub Actions workflow for publishing to npm is broken. Packages are not being published from new releases. A CI/infrastructure issue.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: CI publish workflow (moved to OIDC trusted publishing in 59ff58b); not a runtime test. |

## Regression spec

- N/A — GitHub Actions.

## Rating (2026-09-01)

**#549 — Close: fixed**

- **Action:** Close as fixed: v4.0.4–v4.0.7 were published to npm on 2026-08-03 and 2026-09-01 via OIDC trusted publishing.
- **Why:** Publish workflow works again after commit 59ff58b.
