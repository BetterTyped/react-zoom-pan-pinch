# #113 — Cannot pan with 2-finger gesture when using mac

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/113
- **Reported by:** @GiorgosPap
- **Created:** 2020-05-21
- **Deduped issues:** none
- **Area:** pan

## Summary

Users want two-finger trackpad gestures on Mac to pan the content instead of (or in addition to) zooming. Currently the library interprets all trackpad scroll as zoom wheel events, making native-feeling pan navigation impossible on MacBook trackpads.

## Status log

| Date | Entry |
|------|-------|
| 2026-09-01 | Re-rated against v4.0.7 — see **Rating** below. |

## Rating (2026-09-01)

**#113 — Close: shipped** · cluster `wheel-to-pan`

- **Action:** Close with the recipe: `wheel={{ wheelDisabled: true }}` + `trackPadPanning={{ disabled: false }}` gives two-finger pan while ctrl+wheel (trackpad pinch) still zooms. Add the recipe to the docs if it is not there.
- **Why:** 22 reactions, the most-wanted request. `trackPadPanning` shipped in v4 but is `disabled: true` by default and only runs when wheel zoom does not claim the event.
