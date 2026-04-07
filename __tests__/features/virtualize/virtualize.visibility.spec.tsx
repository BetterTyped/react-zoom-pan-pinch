import {
  isElementVisible,
  getOverlapArea,
  Rect,
} from "../../../src/components/virtualize/virtualize.utils";

const base = {
  scale: 1,
  positionX: 0,
  positionY: 0,
  viewportWidth: 500,
  viewportHeight: 500,
};

describe("Virtualize [Visibility Utils]", () => {
  describe("getOverlapArea", () => {
    it("should return full area when rects are identical", () => {
      const r: Rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(getOverlapArea(r, r)).toBe(10000);
    });

    it("should return 0 when rects do not overlap", () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
      expect(getOverlapArea(a, b)).toBe(0);
    });

    it("should compute partial overlap correctly", () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 50, y: 50, width: 100, height: 100 };
      expect(getOverlapArea(a, b)).toBe(2500);
    });

    it("should return 0 when rects share only an edge", () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 50, y: 0, width: 50, height: 50 };
      expect(getOverlapArea(a, b)).toBe(0);
    });
  });

  describe("isElementVisible", () => {
    describe("basic visibility at scale=1, no offset", () => {
      it("should return true when element is fully inside viewport", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 100,
            elementY: 100,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(true);
      });

      it("should return false when element is fully outside viewport (right)", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 600,
            elementY: 100,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(false);
      });

      it("should return false when element is fully outside viewport (below)", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 100,
            elementY: 600,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(false);
      });

      it("should return false when element is fully outside viewport (left)", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: -100,
            elementY: 100,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(false);
      });

      it("should return false when element is fully outside viewport (above)", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 100,
            elementY: -100,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(false);
      });

      it("should return true when element partially overlaps viewport", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 480,
            elementY: 480,
            elementWidth: 100,
            elementHeight: 100,
          }),
        ).toBe(true);
      });

      it("should return false when element touches viewport edge exactly", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 500,
            elementY: 0,
            elementWidth: 50,
            elementHeight: 50,
          }),
        ).toBe(false);
      });
    });

    describe("with scale", () => {
      it("should account for scale when determining visibility", () => {
        // Element at (300,300) with size 100x100 at scale 2
        // => viewport coords: (600,600) size (200,200) — fully outside 500x500
        expect(
          isElementVisible({
            ...base,
            elementX: 300,
            elementY: 300,
            elementWidth: 100,
            elementHeight: 100,
            scale: 2,
          }),
        ).toBe(false);
      });

      it("should show element that fits viewport at higher scale", () => {
        // Element at (50,50) size 100x100 at scale 2
        // => viewport coords: (100,100) size (200,200) — inside 500x500
        expect(
          isElementVisible({
            ...base,
            elementX: 50,
            elementY: 50,
            elementWidth: 100,
            elementHeight: 100,
            scale: 2,
          }),
        ).toBe(true);
      });

      it("should handle fractional scale", () => {
        // Element at (0,0) size 2000x2000 at scale 0.25
        // => viewport coords: (0,0) size (500,500) — fills viewport
        expect(
          isElementVisible({
            ...base,
            elementX: 0,
            elementY: 0,
            elementWidth: 2000,
            elementHeight: 2000,
            scale: 0.25,
          }),
        ).toBe(true);
      });
    });

    describe("with positionX / positionY (panning)", () => {
      it("should bring off-screen element into view via panning", () => {
        // Element at (600,0) normally outside, but positionX=-200 shifts content left
        // => viewport coord: 600*1 + (-200) = 400, inside 500
        expect(
          isElementVisible({
            ...base,
            elementX: 600,
            elementY: 0,
            elementWidth: 50,
            elementHeight: 50,
            positionX: -200,
          }),
        ).toBe(true);
      });

      it("should push in-view element outside via panning", () => {
        // Element at (100,100) normally in view, but positionX=-600
        // => viewport coord X: 100 + (-600) = -500, right edge at -450, outside
        expect(
          isElementVisible({
            ...base,
            elementX: 100,
            elementY: 100,
            elementWidth: 50,
            elementHeight: 50,
            positionX: -600,
          }),
        ).toBe(false);
      });
    });

    describe("with margin", () => {
      it("should extend viewport by margin pixels", () => {
        // Element at (550,250) is outside 500-wide viewport
        // With margin=100, viewport extends to x=-100..600 — element at 550 is inside
        expect(
          isElementVisible({
            ...base,
            elementX: 550,
            elementY: 250,
            elementWidth: 30,
            elementHeight: 30,
            margin: 100,
          }),
        ).toBe(true);
      });

      it("should not show element beyond the margin", () => {
        // Element at (700,250), margin=100 => viewport extends to 600 — still outside
        expect(
          isElementVisible({
            ...base,
            elementX: 700,
            elementY: 250,
            elementWidth: 30,
            elementHeight: 30,
            margin: 100,
          }),
        ).toBe(false);
      });

      it("should extend viewport in negative direction", () => {
        // Element at (-80,250) is outside, margin=100 => viewport starts at -100
        expect(
          isElementVisible({
            ...base,
            elementX: -80,
            elementY: 250,
            elementWidth: 30,
            elementHeight: 30,
            margin: 100,
          }),
        ).toBe(true);
      });
    });

    describe("with threshold", () => {
      it("should require full visibility when threshold=1", () => {
        // Element partially outside (x goes from 480 to 530, viewport ends at 500)
        expect(
          isElementVisible({
            ...base,
            elementX: 480,
            elementY: 200,
            elementWidth: 50,
            elementHeight: 50,
            threshold: 1,
          }),
        ).toBe(false);
      });

      it("should pass when element is fully inside at threshold=1", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 200,
            elementY: 200,
            elementWidth: 50,
            elementHeight: 50,
            threshold: 1,
          }),
        ).toBe(true);
      });

      it("should check fraction at threshold=0.5", () => {
        // Element 100x100 at (450,200), 50px inside viewport, 50px outside
        // overlap = 50*100 = 5000, area = 10000, fraction = 0.5
        expect(
          isElementVisible({
            ...base,
            elementX: 450,
            elementY: 200,
            elementWidth: 100,
            elementHeight: 100,
            threshold: 0.5,
          }),
        ).toBe(true);
      });

      it("should reject when overlap is below threshold", () => {
        // Element 100x100 at (460,200), 40px inside viewport
        // overlap = 40*100 = 4000, area = 10000, fraction = 0.4
        expect(
          isElementVisible({
            ...base,
            elementX: 460,
            elementY: 200,
            elementWidth: 100,
            elementHeight: 100,
            threshold: 0.5,
          }),
        ).toBe(false);
      });

      it("should return false for zero-size elements with threshold", () => {
        expect(
          isElementVisible({
            ...base,
            elementX: 100,
            elementY: 100,
            elementWidth: 0,
            elementHeight: 0,
            threshold: 0.5,
          }),
        ).toBe(false);
      });
    });

    describe("combined scale + position + margin + threshold", () => {
      it("should compute visibility with all factors", () => {
        // Element at (200,200) size 100x100, scale=2, positionX=-100, positionY=-100
        // viewport coords: (200*2 - 100, 200*2 - 100) = (300, 300), size (200, 200)
        // Right edge at 500, bottom at 500 — fits exactly in 500x500 viewport
        // With threshold=1 and no margin, it should pass (fully inside)
        expect(
          isElementVisible({
            ...base,
            elementX: 200,
            elementY: 200,
            elementWidth: 100,
            elementHeight: 100,
            scale: 2,
            positionX: -100,
            positionY: -100,
            threshold: 1,
          }),
        ).toBe(true);
      });
    });
  });
});
