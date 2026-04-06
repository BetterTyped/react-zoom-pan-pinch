import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("Pan [Sizes]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("When content is bigger than wrapper", () => {
    it("should allow panning to the bottom-right end without moving back", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
      });

      pan({ x: -150, y: -150 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should allow panning with velocity", async () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -10, y: -10, moveEventCount: 5 });

      const posAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(
        posAfterPan,
      );
    });
    it("should not allow to move beyond bounds", async () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
        limitToBounds: true,
      });

      pan({ x: -500, y: -500 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThan(-500);
      expect(ref.current!.instance.state.positionY).toBeGreaterThan(-500);
    });
  });
  describe("When content is smaller than wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        disablePadding: true,
      });

      pan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should not allow for panning with centering", async () => {
      const { ref, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        centerZoomedOut: true,
        disablePadding: true,
      });

      const initialX = ref.current!.instance.state.positionX;
      pan({ x: 100, y: 100 });
      expect(ref.current!.instance.state.positionX).toBe(initialX);
    });
    it("should allow to move content around the wrapper body", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        limitToBounds: false,
      });

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not allow to move beyond bounds", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        disablePadding: true,
        limitToBounds: true,
      });

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  describe("When content is equal to wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        disablePadding: true,
      });

      pan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow to move content around the wrapper body", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        limitToBounds: false,
      });

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not allow to move beyond bounds", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        disablePadding: true,
        limitToBounds: true,
      });

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
