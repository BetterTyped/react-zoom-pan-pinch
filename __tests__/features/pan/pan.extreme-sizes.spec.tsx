import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("Pan [Extreme sizes]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Huge canvas (5000×5000 content in 500×500 wrapper)", () => {
    const huge = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "5000px",
      contentHeight: "5000px",
      disablePadding: true,
    } as const;

    it("should allow panning across the full content range", () => {
      const { ref, pan } = renderApp(huge);

      ref.current!.setTransform(0, 0, 1, 0);
      pan({ x: -4500, y: -4500 });
      expect(ref.current!.instance.state.positionX).toBe(-4500);
      expect(ref.current!.instance.state.positionY).toBe(-4500);
    });

    it("should clamp to bounds on a huge canvas", () => {
      const { ref, pan } = renderApp({ ...huge, limitToBounds: true });

      pan({ x: -10000, y: -10000 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -4500,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -4500,
      );
    });

    it("should not allow panning past positive origin", () => {
      const { ref, pan } = renderApp({ ...huge, limitToBounds: true });

      pan({ x: 5000, y: 5000 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("should pan correctly when deeply zoomed into huge canvas", () => {
      const { ref, pan, zoom } = renderApp(huge);

      zoom({ value: 4 });
      pan({ x: -200, y: -200 });
      expect(ref.current!.instance.state.positionX).toBe(-200);
      expect(ref.current!.instance.state.positionY).toBe(-200);
    });

    it("should handle velocity on huge canvas without overshooting bounds", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        ...huge,
        limitToBounds: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -3000, y: -3000, moveEventCount: 10 });

      act(() => {
        flushAnimationFrames(120);
      });

      const maxNegX = -(5000 * 2 - 500);
      const maxNegY = -(5000 * 2 - 500);
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        maxNegX,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        maxNegY,
      );
    });
  });

  describe("Tall document (500×3000 content in 500×500 wrapper)", () => {
    const tall = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "500px",
      contentHeight: "3000px",
      disablePadding: true,
    } as const;

    it("should not allow horizontal panning when content width equals wrapper", () => {
      const { content, pan } = renderApp(tall);

      pan({ x: -200, y: 0 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });

    it("should allow vertical panning across the full document height", () => {
      const { ref, pan } = renderApp(tall);

      pan({ x: 0, y: -2500 });
      expect(ref.current!.instance.state.positionY).toBe(-2500);
      expect(ref.current!.instance.state.positionX).toBe(0);
    });

    it("should clamp vertical panning to bounds", () => {
      const { ref, pan } = renderApp({ ...tall, limitToBounds: true });

      pan({ x: 0, y: -5000 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("should allow both axes when zoomed", () => {
      const { ref, pan, zoom } = renderApp(tall);

      zoom({ value: 2 });
      pan({ x: -100, y: -100 });
      expect(ref.current!.instance.state.positionX).toBe(-100);
      expect(ref.current!.instance.state.positionY).toBe(-100);
    });
  });

  describe("Wide panorama (3000×300 content in 500×500 wrapper)", () => {
    const wide = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "3000px",
      contentHeight: "300px",
      disablePadding: true,
      centerZoomedOut: true,
    } as const;

    it("should center content vertically when content height is less than wrapper", () => {
      const { ref, pan } = renderApp(wide);

      // Content 300px in 500px wrapper → centered at Y = (500 - 300) / 2 = 100
      const centeredY = (500 - 300) / 2;
      pan({ x: 0, y: -200 });
      expect(ref.current!.instance.state.positionY).toBe(centeredY);
    });

    it("should allow horizontal panning across the full panorama width", () => {
      const { ref, pan } = renderApp(wide);

      const centeredY = (500 - 300) / 2;
      pan({ x: -2500, y: 0 });
      expect(ref.current!.instance.state.positionX).toBe(-2500);
      expect(ref.current!.instance.state.positionY).toBe(centeredY);
    });

    it("should clamp horizontal panning to bounds", () => {
      const { ref, pan } = renderApp({ ...wide, limitToBounds: true });

      pan({ x: -5000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("should allow both axes when zoomed", () => {
      const { ref, pan, zoom } = renderApp(wide);

      zoom({ value: 2 });
      pan({ x: -100, y: -100 });
      expect(ref.current!.instance.state.positionX).toBe(-100);
      expect(ref.current!.instance.state.positionY).toBe(-100);
    });
  });

  describe("Tiny viewport (1000×1000 content in 50×50 wrapper)", () => {
    const tiny = {
      wrapperWidth: "50px",
      wrapperHeight: "50px",
      contentWidth: "1000px",
      contentHeight: "1000px",
      disablePadding: true,
    } as const;

    it("should allow panning across very large content-to-viewport ratio", () => {
      const { ref, pan } = renderApp(tiny);

      pan({ x: -950, y: -950 });
      expect(ref.current!.instance.state.positionX).toBe(-950);
      expect(ref.current!.instance.state.positionY).toBe(-950);
    });

    it("should clamp to bounds even with extreme ratio", () => {
      const { ref, pan } = renderApp({ ...tiny, limitToBounds: true });

      pan({ x: -5000, y: -5000 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -950,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -950,
      );
    });

    it("should not allow panning past positive origin", () => {
      const { ref, pan } = renderApp({ ...tiny, limitToBounds: true });

      pan({ x: 500, y: 500 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("should handle rapid multi-step pan correctly", () => {
      const { ref, pan } = renderApp(tiny);

      pan({ x: -200, y: 0 });
      pan({ x: -200, y: 0 });
      pan({ x: -200, y: 0 });
      expect(ref.current!.instance.state.positionX).toBe(-600);
    });
  });

  describe("Mismatched aspect ratios (4000×200 content in 200×800 wrapper)", () => {
    const mismatched = {
      wrapperWidth: "200px",
      wrapperHeight: "800px",
      contentWidth: "4000px",
      contentHeight: "200px",
      disablePadding: true,
      centerZoomedOut: true,
    } as const;

    it("should allow wide horizontal pan and center vertical axis", () => {
      const { ref, pan } = renderApp(mismatched);

      // Content 200px in 800px wrapper → centered at Y = (800 - 200) / 2 = 300
      const centeredY = (800 - 200) / 2;
      pan({ x: -3800, y: -100 });
      expect(ref.current!.instance.state.positionX).toBe(-3800);
      expect(ref.current!.instance.state.positionY).toBe(centeredY);
    });

    it("should clamp horizontal panning to content bounds", () => {
      const { ref, pan } = renderApp({
        ...mismatched,
        limitToBounds: true,
      });

      pan({ x: -10000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -3800,
      );
    });

    it("should allow vertical pan when zoomed beyond wrapper height", () => {
      const { ref, pan, zoom } = renderApp(mismatched);

      zoom({ value: 5 });
      pan({ x: 0, y: -100 });
      expect(ref.current!.instance.state.positionY).toBe(-100);
    });
  });
});
