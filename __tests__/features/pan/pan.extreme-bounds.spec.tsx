import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("Pan [Extreme bounds]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("limitToBounds with huge canvas (5000×5000 in 500×500)", () => {
    const huge = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "5000px",
      contentHeight: "5000px",
      limitToBounds: true,
      disablePadding: true,
    } as const;

    it("prevents panning beyond right/bottom edge at scale 1", () => {
      const { ref, pan } = renderApp(huge);

      pan({ x: 5000, y: 5000 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("prevents panning beyond left/top edge at scale 1", () => {
      const { ref, pan } = renderApp(huge);

      pan({ x: -10000, y: -10000 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -4500,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -4500,
      );
    });

    it("prevents panning beyond edges at scale 2", () => {
      const { ref, pan } = renderApp(huge);

      ref.current!.setTransform(0, 0, 2);
      pan({ x: -20000, y: -20000 });
      const maxNeg = -(5000 * 2 - 500);
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        maxNeg,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        maxNeg,
      );
    });

    it("prevents positive overshoot at scale 2", () => {
      const { ref, pan } = renderApp(huge);

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 5000, y: 5000 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });
  });

  describe("limitToBounds with tall document (500×3000 in 500×500)", () => {
    const tall = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "500px",
      contentHeight: "3000px",
      limitToBounds: true,
      disablePadding: true,
    } as const;

    it("prevents vertical overshoot past the bottom", () => {
      const { ref, pan } = renderApp(tall);

      pan({ x: 0, y: -10000 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("prevents vertical overshoot past the top", () => {
      const { ref, pan } = renderApp(tall);

      pan({ x: 0, y: 5000 });
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });
  });

  describe("limitToBounds with wide panorama (3000×300 in 500×500)", () => {
    const wide = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "3000px",
      contentHeight: "300px",
      limitToBounds: true,
      disablePadding: true,
    } as const;

    it("prevents horizontal overshoot past the right edge", () => {
      const { ref, pan } = renderApp(wide);

      pan({ x: -10000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("prevents horizontal overshoot past the left edge", () => {
      const { ref, pan } = renderApp(wide);

      pan({ x: 5000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
    });
  });

  describe("limitToBounds with tiny viewport (1000×1000 in 50×50)", () => {
    const tiny = {
      wrapperWidth: "50px",
      wrapperHeight: "50px",
      contentWidth: "1000px",
      contentHeight: "1000px",
      limitToBounds: true,
      disablePadding: true,
    } as const;

    it("prevents overshoot with 20:1 content-to-viewport ratio", () => {
      const { ref, pan } = renderApp(tiny);

      pan({ x: -5000, y: -5000 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -950,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -950,
      );
    });

    it("prevents positive overshoot in tiny viewport", () => {
      const { ref, pan } = renderApp(tiny);

      pan({ x: 500, y: 500 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });
  });

  describe("maxPosition/minPosition with extreme content", () => {
    it("clamps huge canvas pan to maxPositionX/Y at scale 2", () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "5000px",
        contentHeight: "5000px",
        maxPositionX: 100,
        maxPositionY: 100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 1000, y: 1000 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(100);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(100);
    });

    it("clamps large equal-size content to minPositionX/Y at scale 3", () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "500px",
        contentHeight: "500px",
        minPositionX: -200,
        minPositionY: -200,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 3);
      pan({ x: -5000, y: -5000 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -200,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -200,
      );
    });
  });

  describe("Axis lock with extreme sizes", () => {
    it("lockAxisX prevents X movement on huge canvas while allowing Y", () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "5000px",
        contentHeight: "5000px",
        panning: { lockAxisX: true },
        disablePadding: true,
      });

      pan({ x: -1000, y: -1000 });
      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(-1000);
    });

    it("lockAxisY prevents Y movement on wide panorama while allowing X", () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "3000px",
        contentHeight: "3000px",
        panning: { lockAxisY: true },
        disablePadding: true,
      });

      pan({ x: -1000, y: -1000 });
      expect(ref.current!.instance.state.positionX).toBe(-1000);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
  });

  describe("Velocity with extreme sizes and bounds", () => {
    it("velocity on tall document does not overshoot vertical bounds", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "500px",
        contentHeight: "3000px",
        limitToBounds: true,
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 1);
      pan({ x: 0, y: -2000, moveEventCount: 10 });

      act(() => {
        flushAnimationFrames(120);
      });

      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("velocity on wide panorama does not overshoot horizontal bounds", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "3000px",
        contentHeight: "300px",
        limitToBounds: true,
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 1);
      pan({ x: -2000, y: 0, moveEventCount: 10 });

      act(() => {
        flushAnimationFrames(120);
      });

      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -2500,
      );
    });

    it("velocity on huge canvas at high zoom stays in bounds", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "5000px",
        contentHeight: "5000px",
        limitToBounds: true,
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 3);
      pan({ x: -5000, y: -5000, moveEventCount: 10 });

      act(() => {
        flushAnimationFrames(120);
      });

      const maxNeg = -(5000 * 3 - 500);
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        maxNeg,
      );
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        maxNeg,
      );
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(0);
    });
  });
});
