# #358 — OnClick doesnt work inside \<area\>

- **GitHub:** https://github.com/BetterTyped/react-zoom-pan-pinch/issues/358
- **Category:** insufficient-info

## Reason

The issue reports that click events do not work on `<area>` elements inside the transform container, but provides no code sample, no reproduction steps, and no version info. The HTML `<area>` element has specific interaction requirements (image maps) that likely conflict with transform wrappers, but without a repro this is not actionable.

## Rating (2026-09-01)

**#358 — Close: no repro**

- **Action:** Close: no repro for `<area>` clicks.
- **Why:** Insufficient info.
