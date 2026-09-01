import {
  getOverlapArea,
  isElementVisible,
} from "../../src/components/virtualize/virtualize.utils";

const viewport = { viewportWidth: 500, viewportHeight: 500 };
const identity = { scale: 1, positionX: 0, positionY: 0 };

describe("virtualize.utils", () => {
  describe("getOverlapArea", () => {
    it("returns the intersection area", () => {
      expect(
        getOverlapArea(
          { x: 0, y: 0, width: 100, height: 100 },
          { x: 50, y: 50, width: 100, height: 100 },
        ),
      ).toBe(2500);
    });

    it("returns 0 for disjoint or merely touching rectangles", () => {
      expect(
        getOverlapArea(
          { x: 0, y: 0, width: 100, height: 100 },
          { x: 200, y: 0, width: 100, height: 100 },
        ),
      ).toBe(0);
      expect(
        getOverlapArea(
          { x: 0, y: 0, width: 100, height: 100 },
          { x: 100, y: 0, width: 100, height: 100 },
        ),
      ).toBe(0);
    });

    it("returns the smaller area when one rectangle contains the other", () => {
      expect(
        getOverlapArea(
          { x: 0, y: 0, width: 100, height: 100 },
          { x: 10, y: 10, width: 20, height: 20 },
        ),
      ).toBe(400);
    });
  });

  describe("isElementVisible", () => {
    const element = (x: number, y: number, size = 100) => ({
      elementX: x,
      elementY: y,
      elementWidth: size,
      elementHeight: size,
    });

    it("is true for an element inside the viewport", () => {
      expect(
        isElementVisible({ ...element(10, 10), ...identity, ...viewport }),
      ).toBe(true);
    });

    it("is false for an element completely outside", () => {
      expect(
        isElementVisible({ ...element(600, 10), ...identity, ...viewport }),
      ).toBe(false);
      expect(
        isElementVisible({ ...element(10, -200), ...identity, ...viewport }),
      ).toBe(false);
    });

    it("is true for a partial overlap by default", () => {
      expect(
        isElementVisible({ ...element(450, 450), ...identity, ...viewport }),
      ).toBe(true);
    });

    it("is false when the element only touches the viewport edge", () => {
      expect(
        isElementVisible({ ...element(500, 0), ...identity, ...viewport }),
      ).toBe(false);
    });

    it("applies the pan offset", () => {
      expect(
        isElementVisible({
          ...element(600, 10),
          ...identity,
          positionX: -200,
          ...viewport,
        }),
      ).toBe(true);
    });

    it("applies the scale", () => {
      // 300 * 2 = 600 > viewport width when scaled up.
      expect(
        isElementVisible({
          ...element(300, 10),
          ...identity,
          scale: 2,
          ...viewport,
        }),
      ).toBe(false);
      // 600 * 0.5 = 300 < viewport width when scaled down.
      expect(
        isElementVisible({
          ...element(600, 10),
          ...identity,
          scale: 0.5,
          ...viewport,
        }),
      ).toBe(true);
    });

    it("counts elements within the margin as visible", () => {
      expect(
        isElementVisible({ ...element(550, 10), ...identity, ...viewport }),
      ).toBe(false);
      expect(
        isElementVisible({
          ...element(550, 10),
          ...identity,
          ...viewport,
          margin: 60,
        }),
      ).toBe(true);
    });

    it("requires full containment for threshold 1", () => {
      expect(
        isElementVisible({
          ...element(450, 10),
          ...identity,
          ...viewport,
          threshold: 1,
        }),
      ).toBe(false);
      expect(
        isElementVisible({
          ...element(400, 10),
          ...identity,
          ...viewport,
          threshold: 1,
        }),
      ).toBe(true);
    });

    it("compares the overlapping fraction against the threshold", () => {
      // 50 px of a 100 px wide element are inside: 50 % overlap.
      const half = { ...element(450, 10), ...identity, ...viewport };
      expect(isElementVisible({ ...half, threshold: 0.5 })).toBe(true);
      expect(isElementVisible({ ...half, threshold: 0.51 })).toBe(false);
    });

    it("treats zero-area elements as hidden when a threshold is set", () => {
      expect(
        isElementVisible({
          ...element(10, 10, 0),
          ...identity,
          ...viewport,
          threshold: 0.5,
        }),
      ).toBe(false);
    });
  });
});
