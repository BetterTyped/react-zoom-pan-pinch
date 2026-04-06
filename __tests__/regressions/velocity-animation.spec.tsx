import { act } from "@testing-library/react";

import {
  renderApp,
  flushAnimationFrames,
  DEFAULT_MS_PER_STEP,
} from "../utils";

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
      expect(ref.current!.instance.state.scale).toBe(1.5);
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
