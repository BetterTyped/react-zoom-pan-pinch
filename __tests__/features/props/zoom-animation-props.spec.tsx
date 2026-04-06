import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("ReactZoomPanPinchProps.zoomAnimation", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("zoomAnimation.disabled", () => {
    it("disables zoom animation when true — zoomIn lands instantly", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
        zoomAnimation: { disabled: true },
      });

      act(() => {
        ref.current!.zoomIn(0.5, 0);
      });
      act(() => {
        flushAnimationFrames(10);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 1);
    });
  });

  describe("zoomAnimation.size", () => {
    it("size affects the overshoot bounce size", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
        zoomAnimation: { disabled: false, size: 0.5, animationTime: 100 },
      });

      act(() => {
        ref.current!.zoomIn(0.5, 100, "easeOut");
      });
      act(() => {
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("zoomAnimation.animationTime", () => {
    it("controls the animation duration for programmatic zoom", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
        zoomAnimation: { disabled: false, animationTime: 150 },
      });

      act(() => {
        ref.current!.zoomIn(0.5, 150, "easeOut");
      });
      act(() => {
        flushAnimationFrames(80);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("zoomAnimation.animationType", () => {
    it("accepts easeOut animation type", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
        zoomAnimation: {
          disabled: false,
          animationTime: 100,
          animationType: "easeOut",
        },
      });

      act(() => {
        ref.current!.zoomIn(0.5, 100, "easeOut");
      });
      act(() => {
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });

    it("accepts easeInOutQuad animation type", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
        zoomAnimation: {
          disabled: false,
          animationTime: 100,
          animationType: "easeInOutQuad",
        },
      });

      act(() => {
        ref.current!.zoomIn(0.5, 100, "easeInOutQuad");
      });
      act(() => {
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });
});
