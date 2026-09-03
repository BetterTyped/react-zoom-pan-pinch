import {
  boundLimiter,
  clamp,
  getBounds,
  getComponentsSizes,
  getMouseBoundedPosition,
  rubberbandIfOutOfBounds,
} from "../../src/core/bounds/bounds.utils";
import { checkZoomBounds } from "../../src/core/zoom/zoom.utils";
import { BoundsType } from "../../src/models";

const element = (width: number, height: number) =>
  ({
    offsetWidth: width,
    offsetHeight: height,
    clientWidth: width,
    clientHeight: height,
  }) as HTMLDivElement;

describe("bounds.utils", () => {
  describe("getComponentsSizes", () => {
    it("scales the content size and reports the difference to the wrapper", () => {
      expect(
        getComponentsSizes(element(500, 400), element(300, 200), 2),
      ).toEqual({
        wrapperWidth: 500,
        wrapperHeight: 400,
        newContentWidth: 600,
        newContentHeight: 400,
        newDiffWidth: -100,
        newDiffHeight: 0,
      });
    });
  });

  describe("getBounds", () => {
    it("lets the content slide anywhere inside the wrapper when it fits (centerZoomedOut: false)", () => {
      const bounds = getBounds(500, 200, 300, 500, 100, 400, false);
      expect(bounds).toMatchObject({
        minPositionX: 0,
        maxPositionX: 300,
        minPositionY: 0,
        maxPositionY: 400,
      });
    });

    it("locks fitting content to the center when centerZoomedOut is true", () => {
      const bounds = getBounds(500, 200, 300, 500, 100, 400, true);
      expect(bounds).toMatchObject({
        minPositionX: 150,
        maxPositionX: 150,
        minPositionY: 200,
        maxPositionY: 200,
      });
    });

    it("limits overflowing content to its own edges", () => {
      const bounds = getBounds(500, 2000, -1500, 500, 1000, -500, false);
      expect(bounds).toMatchObject({
        minPositionX: -1500,
        maxPositionX: 0,
        minPositionY: -500,
        maxPositionY: 0,
      });
    });

    it("handles one overflowing and one fitting axis independently", () => {
      const bounds = getBounds(500, 2000, -1500, 500, 100, 400, true);
      expect(bounds).toMatchObject({
        minPositionX: -1500,
        maxPositionX: 0,
        minPositionY: 200,
        maxPositionY: 200,
      });
    });
  });

  describe("clamp", () => {
    it("keeps values inside the range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("rubberbandIfOutOfBounds", () => {
    it("returns the position unchanged inside the bounds", () => {
      expect(rubberbandIfOutOfBounds(5, 0, 10)).toBe(5);
    });

    it("clamps when the constant is 0", () => {
      expect(rubberbandIfOutOfBounds(15, 0, 10, 0)).toBe(10);
      expect(rubberbandIfOutOfBounds(-5, 0, 10, 0)).toBe(0);
    });

    it("lets the position overshoot with resistance", () => {
      const above = rubberbandIfOutOfBounds(20, 0, 10);
      expect(above).toBeGreaterThan(10);
      expect(above).toBeLessThan(20);

      const below = rubberbandIfOutOfBounds(-10, 0, 10);
      expect(below).toBeLessThan(0);
      expect(below).toBeGreaterThan(-10);
    });

    it("grows monotonically with the overshoot", () => {
      const small = rubberbandIfOutOfBounds(12, 0, 10);
      const large = rubberbandIfOutOfBounds(40, 0, 10);
      expect(large).toBeGreaterThan(small);
    });

    it("falls back to a power curve for a zero-sized range", () => {
      const value = rubberbandIfOutOfBounds(4, 0, 0, 0.2);
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    });
  });

  describe("boundLimiter", () => {
    it("matches the documented examples", () => {
      expect(boundLimiter(2, 0, 3, true)).toBe(2);
      expect(boundLimiter(4, 0, 3, true)).toBe(3);
      expect(boundLimiter(-2, 0, 3, true)).toBe(0);
      expect(boundLimiter(10, 0, 3, false)).toBe(10);
    });

    it("rounds to two decimals", () => {
      expect(boundLimiter(1.23456, 0, 3, true)).toBe(1.23);
      expect(boundLimiter(1.23456, 0, 3, false)).toBe(1.23);
      expect(boundLimiter(-5, -0.005, 3, true)).toBe(-0.01);
    });
  });

  describe("getMouseBoundedPosition", () => {
    const bounds: BoundsType = {
      minPositionX: -100,
      maxPositionX: 0,
      minPositionY: -50,
      maxPositionY: 0,
      scaleWidthFactor: 0,
      scaleHeightFactor: 0,
    };

    it("clamps to the bounds when limitToBounds is on", () => {
      expect(
        getMouseBoundedPosition(20, -80, bounds, true, 0, 0, null),
      ).toEqual({ x: 0, y: -50 });
    });

    it("leaves the position alone when limitToBounds is off", () => {
      expect(
        getMouseBoundedPosition(20, -80, bounds, false, 0, 0, null),
      ).toEqual({ x: 20, y: -80 });
    });

    it("widens the bounds by the padding only when a wrapper is present", () => {
      const wrapper = element(500, 500);
      expect(
        getMouseBoundedPosition(20, -80, bounds, true, 30, 40, wrapper),
      ).toEqual({ x: 20, y: -80 });
      expect(
        getMouseBoundedPosition(20, -80, bounds, true, 30, 40, null),
      ).toEqual({ x: 0, y: -50 });
    });
  });
});

describe("zoom.utils", () => {
  describe("checkZoomBounds", () => {
    it("keeps a value inside the range", () => {
      expect(checkZoomBounds(2, 1, 8, 0, false)).toBe(2);
    });

    it("clamps to min and max", () => {
      expect(checkZoomBounds(0.5, 1, 8, 0, false)).toBe(1);
      expect(checkZoomBounds(9, 1, 8, 0, false)).toBe(8);
    });

    it("extends the range by the padding when enabled", () => {
      expect(checkZoomBounds(0.7, 1, 8, 0.4, true)).toBe(0.7);
      expect(checkZoomBounds(0.5, 1, 8, 0.4, true)).toBe(0.6);
      expect(checkZoomBounds(8.3, 1, 8, 0.4, true)).toBe(8.3);
      expect(checkZoomBounds(9, 1, 8, 0.4, true)).toBe(8.4);
    });

    it("ignores the padding when disabled", () => {
      expect(checkZoomBounds(0.7, 1, 8, 0.4, false)).toBe(1);
    });

    it("never returns a zero or negative scale", () => {
      expect(checkZoomBounds(0, 0, 8, 0, false)).toBe(1e-7);
      expect(checkZoomBounds(-1, -5, 8, 0, false)).toBe(1e-7);
      // Padding larger than minScale floors the padded minimum, it does not
      // go negative.
      expect(checkZoomBounds(0, 0.2, 8, 0.5, true)).toBe(1e-7);
      expect(checkZoomBounds(0.05, 0.2, 8, 0.5, true)).toBe(0.05);
    });

    it("skips a NaN limit", () => {
      expect(checkZoomBounds(20, 1, NaN, 0, false)).toBe(20);
      expect(checkZoomBounds(0.5, NaN, 8, 0, false)).toBe(0.5);
    });
  });
});
