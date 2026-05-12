import { act, fireEvent } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

const TOUCH_POINT = { clientX: 0, clientY: 0 };

describe("Zoom [Double click]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("double-click zooms in by step amount", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      doubleClick: { disabled: false, step: 0.5, animationTime: 80 },
      smooth: false,
    });

    act(() => {
      fireEvent.doubleClick(content);
    });
    act(() => {
      flushAnimationFrames(40);
    });

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("double-click does not zoom when disabled", () => {
    const { content, ref } = renderApp({
      doubleClick: { disabled: true },
    });

    fireEvent.doubleClick(content);
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("double-click reset mode returns to scale 1 after zoom", () => {
    jest.useFakeTimers();
    const { content, ref, zoom } = renderApp({
      doubleClick: { disabled: false, mode: "reset", animationTime: 50 },
      smooth: false,
    });

    zoom({ value: 2 });
    expect(ref.current!.instance.state.scale).toBeCloseTo(2, 0);

    act(() => {
      fireEvent.doubleClick(content);
    });
    act(() => {
      flushAnimationFrames(40);
    });

    expect(ref.current!.instance.state.scale).toBeCloseTo(1, 0);
  });

  it("double-click on excluded element is ignored", () => {
    const { wrapper, ref } = renderApp({
      doubleClick: { disabled: false, excluded: ["panningDisabled"] },
    });

    const excluded = wrapper.querySelector(".panningDisabled");
    fireEvent.doubleClick(excluded!);
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  describe("iOS synthetic dblclick suppression", () => {
    // On iOS, every tap fires a synthetic `click` ~300 ms after touchend.
    // Two fast taps produce two such clicks close enough for the browser to
    // also fire a `dblclick`. The `dblclick` listener is only registered on
    // non-touch devices; touch double-tap is handled exclusively via touchstart.

    it("touch double-tap zooms in", () => {
      jest.useFakeTimers();

      const { content, ref } = renderApp({
        doubleClick: { disabled: false, step: 0.5, animationTime: 50 },
        smooth: false,
      });

      // First touchstart – sets lastTouch.
      act(() => {
        fireEvent.touchStart(content, { touches: [{ ...TOUCH_POINT, target: content }] });
      });

      // 100 ms between taps – within the 200 ms double-tap detection window.
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Second touchstart – library detects double-tap and starts zoom animation.
      act(() => {
        fireEvent.touchStart(content, { touches: [{ ...TOUCH_POINT, target: content }] });
      });

      act(() => {
        flushAnimationFrames(5, 10);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });

    it("synthetic dblclick after touch double-tap does not re-toggle zoom", () => {
      jest.useFakeTimers();

      const ANIMATION_MS = 50;
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, step: 0.5, animationTime: ANIMATION_MS },
        smooth: false,
      });

      act(() => {
        fireEvent.touchStart(content, { touches: [{ ...TOUCH_POINT, target: content }] });
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      act(() => {
        fireEvent.touchStart(content, { touches: [{ ...TOUCH_POINT, target: content }] });
      });
      act(() => {
        flushAnimationFrames(5, ANIMATION_MS / 5);
      });

      const scaleAfterDoubleTap = ref.current!.instance.state.scale;
      expect(scaleAfterDoubleTap).toBeGreaterThan(1);

      // Simulate the synthetic dblclick iOS fires after the touch sequence.
      // Because the dblclick listener is not registered on touch devices,
      // this should have no effect on scale.
      act(() => {
        fireEvent.doubleClick(content);
      });

      expect(ref.current!.instance.state.scale).toBe(scaleAfterDoubleTap);
    });
  });
});
