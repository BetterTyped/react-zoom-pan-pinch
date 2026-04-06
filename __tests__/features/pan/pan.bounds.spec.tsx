import { act, waitFor } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("Pan [Bounds]", () => {
  describe("When zoomed and limitToBounds is true", () => {
    it("prevents panning beyond right edge", () => {
      const { pan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 2000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThan(2000);
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(0);
    });

    it("prevents panning beyond left edge (negative X)", () => {
      const { pan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: -2000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThan(-2000);
    });

    it("prevents panning beyond bottom edge (negative Y)", () => {
      const { pan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: -2000 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThan(-2000);
    });
  });

  describe("When maxPositionX/Y is set", () => {
    it("clamps horizontal pan to maxPositionX", () => {
      const { pan, ref } = renderApp({
        maxPositionX: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 500, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(50);
    });

    it("clamps vertical pan to maxPositionY", () => {
      const { pan, ref } = renderApp({
        maxPositionY: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: 500 });
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(50);
    });
  });

  describe("When minPositionX/Y is set", () => {
    it("clamps horizontal pan to minPositionX", () => {
      const { pan, ref } = renderApp({
        minPositionX: -30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: -500, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(-30);
    });

    it("clamps vertical pan to minPositionY", () => {
      const { pan, ref } = renderApp({
        minPositionY: -30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: -500 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(-30);
    });
  });

  describe("When autoAlignment is enabled with bounds", () => {
    it("snaps back after overscroll with padding", async () => {
      const { pan, content } = renderApp({
        autoAlignment: { disabled: false },
        disablePadding: false,
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("Axis lock with bounds", () => {
    it("lockAxisX prevents X movement while allowing Y", () => {
      const { pan, content } = renderApp({
        panning: { lockAxisX: true },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });

    it("lockAxisY prevents Y movement while allowing X", () => {
      const { pan, content } = renderApp({
        panning: { lockAxisY: true },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });

  describe("Velocity with bounds", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("velocity respects limitToBounds (does not overshoot past bounds)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        velocityAnimation: { disabled: false },
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      pan({ x: 500, y: 0, moveEventCount: 5 });

      act(() => {
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(0);
    });
  });
});
