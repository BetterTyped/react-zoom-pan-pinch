import { act } from "@testing-library/react";

import {
  renderApp,
  flushAnimationFrames,
  DEFAULT_MS_PER_STEP,
} from "../utils";

/**
 * Helper to mock offsetWidth/offsetHeight on a DOM element.
 * jsdom does not compute layout, so dimensions are 0 by default.
 */
function mockDimensions(
  el: HTMLElement,
  width: number,
  height: number,
): void {
  Object.defineProperty(el, "offsetWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(el, "offsetHeight", {
    value: height,
    configurable: true,
  });
}

describe("regressions: velocity and zoom animation", () => {
  describe("Ref #363", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("velocity / inertia applies at default scale 1 when velocity is enabled (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        velocityAnimation: { disabled: false },
        limitToBounds: false,
      });

      pan({ x: -120, y: 0, moveEventCount: 10, msPerStep: DEFAULT_MS_PER_STEP });
      const xAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).not.toBe(xAfterPan);
    });

    it("velocity triggers when content is larger than wrapper at scale 1 — big image scenario (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
      });

      // Content (800×600) overflows the wrapper (400×400) at scale 1
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 800, 600);

      pan({ x: -120, y: 0, moveEventCount: 10, msPerStep: DEFAULT_MS_PER_STEP });
      const xAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).not.toBe(xAfterPan);
    });

    it("velocity triggers after zooming in and returning to initial scale when content overflows (Ref #363)", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
        limitToBounds: false,
      });

      // Content (800×600) overflows wrapper (400×400)
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 800, 600);

      // Zoom in then reset to scale 1
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

      pan({ x: -120, y: 0, moveEventCount: 10, msPerStep: DEFAULT_MS_PER_STEP });
      const xAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.positionX).not.toBe(xAfterPan);
    });

    it("does not trigger velocity when content fits inside wrapper at scale 1", () => {
      jest.useFakeTimers();
      const { pan, ref, wrapper, content } = renderApp({
        velocityAnimation: { disabled: false },
      });

      // Content (200×200) fits inside wrapper (400×400)
      mockDimensions(wrapper, 400, 400);
      mockDimensions(content, 200, 200);

      pan({ x: -120, y: 0, moveEventCount: 10, msPerStep: DEFAULT_MS_PER_STEP });
      const xAfterPan = ref.current!.instance.state.positionX;

      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBe(xAfterPan);
    });
  });

  describe("Ref #443", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

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
    afterEach(() => {
      jest.useRealTimers();
    });

    it("zoomAnimation.disabled skips programmatic zoom animation (Ref #508)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        zoomAnimation: { disabled: true },
        smooth: false,
      });

      act(() => {
        ref.current!.zoomIn(0.5);
      });

      expect(ref.current!.instance.state.scale).toBe(1.5);
    });
  });

  describe("Ref #545", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("zoomIn(step) with linear mode ends at exactly startScale + step (Ref #545)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({
        smooth: false,
      });

      act(() => {
        ref.current!.zoomIn(0.25, 300, "easeOut");
      });

      act(() => {
        flushAnimationFrames(200);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.25, 1);
    });
  });
});
