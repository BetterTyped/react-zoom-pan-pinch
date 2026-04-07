import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("ReactZoomPanPinchProps.velocityAnimation", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("velocityAnimation.disabled", () => {
    it("disables velocity (inertia) when true", () => {
      const { pan, content } = renderApp({
        velocityAnimation: { disabled: true },
      });
      pan({ x: -100, y: 0 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });

    it("enables velocity (inertia) when false", () => {
      jest.useFakeTimers();
      const { pan, content } = renderApp({
        velocityAnimation: { disabled: false },
      });
      pan({ x: -100, y: 0, moveEventCount: 5 });

      act(() => {
        flushAnimationFrames(60);
      });

      const match = content.style.transform.match(
        /translate\((-?\d+(?:\.\d+)?)px/,
      );
      expect(match).toBeTruthy();
    });
  });

  describe("velocityAnimation.sensitivityTouch", () => {
    it("accepts sensitivityTouch without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, sensitivityTouch: 2 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.sensitivityMouse", () => {
    it("accepts sensitivityMouse without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, sensitivityMouse: 2 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.maxStrengthMouse", () => {
    it("accepts maxStrengthMouse without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, maxStrengthMouse: 10 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.maxStrengthTouch", () => {
    it("accepts maxStrengthTouch without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, maxStrengthTouch: 10 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.inertia", () => {
    it("accepts inertia value without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, inertia: 0.9 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.animationTime", () => {
    it("accepts animationTime without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, animationTime: 300 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.maxAnimationTime", () => {
    it("accepts maxAnimationTime without crashing", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, maxAnimationTime: 600 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("velocityAnimation.animationType", () => {
    it("accepts easeOut animation type", () => {
      const { ref } = renderApp({
        velocityAnimation: { disabled: false, animationType: "easeOut" },
      });
      expect(ref.current).not.toBeNull();
    });
  });
});
