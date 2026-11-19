# #280 — Virtual keyboard desynchronizes transform state

## Metadata

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/280
- **Reported by:** @PiotrTecza
- **Created:** 2022-02-17
- **Reported-against version:** _unverified_
- **Deduped issues:** none
- **Area:** pan

## Summary

On iOS Safari and Android Chrome, when a text input inside TransformComponent gains focus, the virtual keyboard pushes content up but the transform state is not updated, causing misaligned pan coordinates.

## Resolution log

| Date | Entry |
|------|-------|
| 2026-09-01 | **Not testable in Jest.** Reviewed: virtual keyboard viewport shifts need a real device; no code change. |
| 2026-11-19 | **Fixed on master (unreleased).** The wrapper listens to `scroll`: a browser scroll of the `overflow: hidden` wrapper (input focus, virtual keyboard, `scrollIntoView`) is folded into `positionX/Y` and the scroll is reset to 0, so the focused input stays visible and the content can be panned back. Covers #477. jsdom spec simulates the scroll; not device-tested yet. |

## Regression spec

- `__tests__/regressions/wrapper-scroll.spec.tsx` (simulated scroll; the virtual keyboard itself still needs a device).

## Rating (2026-09-01)

**#280 — Discuss** · priority medium · cluster `focus-scroll`

- **Action:** Decide whether to handle focus-driven scroll of the wrapper: listen to `scroll` on the wrapper, fold `scrollLeft/scrollTop` into the transform and reset them to 0. Needs a real-device check before and after.
- **Why:** Both #280 (virtual keyboard) and #477 (input focus) are the browser scrolling the `overflow: hidden` wrapper to reveal a focused control; the transform state never learns about it.
