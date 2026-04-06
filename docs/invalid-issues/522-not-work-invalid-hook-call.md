# #522 — not work

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/522
- **Category:** user-error

## Reason

The reported error is "Uncaught Invariant Violation: Invalid hook call", which is caused by React version mismatch or multiple copies of React in the bundle. This is a project configuration issue (duplicate React instances, mismatched versions), not a bug in the library. The React docs explicitly document this error and its causes.
