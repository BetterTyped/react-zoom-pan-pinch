import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames, DEFAULT_MS_PER_STEP } from "../utils";

/**
 * Helper to mock offsetWidth/offsetHeight on a DOM element.
 * jsdom does not compute layout, so dimensions are 0 by default.
 */
function mockDimensions(el: HTMLElement, width: number, height: number): void {
  Object.defineProperty(el, "offsetWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(el, "offsetHeight", {
    value: height,
    configurable: true,
  });
}

const flick = (pan: ReturnType<typeof renderApp>["pan"]) =>
  pan({
    x: -120,
    y: 0,
    moveEventCount: 10,
    msPerStep: DEFAULT_MS_PER_STEP,
  });

describe("regressions: velocity and zoom animation", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Ref #363", () => {
    it("velocity / inertia applies at default scale 1 when bounds are unlimited (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        velocityAnimation: { disabled: false },
        limitToBounds: false,
      });

      flick(pan);
      const xAfterPan = ref.current!.instance.state.positionX;
      // The release consumed the velocity into a running inertia animation.
      expect(ref.current!.instance.animation).not.toBeNull();

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBeLessThan(xAfterPan);
    });

    it("velocity triggers when content is larger than wrapper at scale 1 — big image scenario (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
      });

      // Content (800×600) overflows the wrapper (400×400) at scale 1
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 800, 600);

      flick(pan);
      const xAfterPan = ref.current!.instance.state.positionX;
      // The release consumed the velocity into a running inertia animation.
      expect(ref.current!.instance.animation).not.toBeNull();

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBeLessThan(xAfterPan);
    });

    it("velocity triggers after zooming in and returning to scale 1 when content overflows (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
      });

      // Content (800×600) overflows wrapper (400×400), bounds stay limited so
      // the overflow check is what allows the velocity.
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 800, 600);

      act(() => {
        ref.current!.zoomIn(1);
      });
      act(() => {
        flushAnimationFrames();
      });
      act(() => {
        ref.current!.resetTransform(0);
      });
      expect(ref.current!.instance.state.scale).toBe(1);

      flick(pan);
      const xAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.positionX).toBeLessThan(xAfterPan);
    });

    it("does not compute or apply velocity when content fits inside the wrapper at scale 1", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
      });

      // Content (200×200) fits inside wrapper (400×400)
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 200, 200);

      flick(pan);
      const xAfterPan = ref.current!.instance.state.positionX;
      // Pins isVelocityCalculationAllowed, not only the release guard: no
      // velocity was ever computed, so no inertia animation was scheduled.
      expect(ref.current!.instance.velocity).toBeNull();
      expect(ref.current!.instance.animation).toBeNull();

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBe(xAfterPan);
    });
  });

  describe("Ref #443", () => {
    it("onPanning fires during post-release velocity animation (Ref #443)", () => {
      jest.useFakeTimers();
      const onPanning = jest.fn();
      const { pan, zoom, ref } = renderApp({
        velocityAnimation: { disabled: false },
        limitToBounds: false,
        onPanning,
      });

      zoom({ value: 1.5 });
      pan({ x: -80, y: 0, moveEventCount: 8, msPerStep: DEFAULT_MS_PER_STEP });

      const callsAfterPan = onPanning.mock.calls.length;

      act(() => {
        flushAnimationFrames();
      });

      expect(onPanning.mock.calls.length).toBeGreaterThan(callsAfterPan);
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 1);
    });
  });

  describe("Ref #508", () => {
    it("zoomAnimation.disabled applies programmatic zoom synchronously (Ref #508)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({ zoomAnimation: { disabled: true } });

      act(() => {
        ref.current!.zoomIn(0.5);
      });

      // No frame flushed: with an animation the scale would still be 1 here.
      expect(ref.current!.instance.state.scale).toBe(1.5);
    });

    it("zoomAnimation.disabled skips the elastic snap-back animation after a wheel overshoot (Ref #508)", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        minScale: 0.5,
        smooth: false,
        wheel: { step: 0.2 },
        zoomAnimation: { disabled: true },
      });

      for (let i = 0; i < 10; i += 1) {
        act(() => {
          content.dispatchEvent(
            new WheelEvent("wheel", {
              bubbles: true,
              deltaY: 50,
              ctrlKey: true,
            }),
          );
        });
      }

      // With the animation disabled there is no padding either: the scale is
      // clamped at minScale right away and stays there.
      expect(ref.current!.instance.state.scale).toBe(0.5);
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(ref.current!.instance.state.scale).toBe(0.5);
    });
  });

  describe("Ref #545", () => {
    it("zoomIn(step) under the default (smooth) props ends at exactly startScale + step (Ref #545)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp();

      act(() => {
        ref.current!.zoomIn(0.25, 300, "easeOut");
      });
      act(() => {
        flushAnimationFrames(200);
      });
      // An exponential step would land on e^0.25 = 1.284.
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.25, 10);

      act(() => {
        ref.current!.zoomIn(0.25, 300, "easeOut");
      });
      act(() => {
        flushAnimationFrames(200);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);
    });

    it("zoomOut(step) subtracts the step and clamps at minScale (Ref #545)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({ initialScale: 1.4 });

      act(() => {
        ref.current!.zoomOut(0.25, 300, "easeOut");
      });
      act(() => {
        flushAnimationFrames(200);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.15, 10);

      act(() => {
        ref.current!.zoomOut(0.25, 300, "easeOut");
      });
      act(() => {
        flushAnimationFrames(200);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1, 10);
    });
  });
});
