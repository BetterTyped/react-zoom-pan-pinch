import { act, fireEvent } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("ReactZoomPanPinchProps.doubleClick", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("doubleClick.disabled", () => {
    it("blocks double-click zoom when true", () => {
      const { content, ref } = renderApp({
        doubleClick: { disabled: true },
      });
      fireEvent.doubleClick(content);
      expect(ref.current!.instance.state.scale).toBe(1);
    });

    it("enables double-click zoom when false", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, step: 0.5, animationTime: 50 },
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
  });

  describe("doubleClick.step", () => {
    it("controls the zoom increment on double-click", () => {
      jest.useFakeTimers();
      const run = (step: number) => {
        const { content, ref, unmount } = renderApp({
          doubleClick: { disabled: false, step, animationTime: 50 },
          smooth: false,
        });
        act(() => {
          fireEvent.doubleClick(content);
        });
        act(() => {
          flushAnimationFrames(40);
        });
        const scale = ref.current!.instance.state.scale;
        unmount();
        return scale;
      };
      expect(run(0.8)).toBeGreaterThan(run(0.3));
    });
  });

  describe("doubleClick.mode", () => {
    it("mode 'zoomIn' zooms in on double-click", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, mode: "zoomIn", step: 0.5, animationTime: 50 },
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

    it("mode 'zoomOut' zooms out on double-click", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, mode: "zoomOut", step: 0.3, animationTime: 50 },
        smooth: false,
        minScale: 0.2,
      });
      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
      });
      expect(ref.current!.instance.state.scale).toBeLessThan(1);
    });

    it("mode 'reset' resets to initial scale on double-click", () => {
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

    it("mode 'toggle' toggles between zoom in and reset", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, mode: "toggle", step: 0.7, animationTime: 80 },
        smooth: false,
      });

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1, 1);
    });
  });

  describe("doubleClick.animationTime", () => {
    it("controls the duration of the double-click zoom animation", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, step: 0.5, animationTime: 200 },
        smooth: false,
      });
      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(60);
      });
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("doubleClick.animationType", () => {
    it("accepts different animation types", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: {
          disabled: false,
          step: 0.5,
          animationTime: 50,
          animationType: "easeOut",
        },
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
  });

  describe("doubleClick.excluded", () => {
    it("does not zoom on double-click on excluded element", () => {
      const { wrapper, ref } = renderApp({
        doubleClick: { disabled: false, excluded: ["panningDisabled"] },
      });
      const excluded = wrapper.querySelector(".panningDisabled");
      expect(excluded).toBeTruthy();
      fireEvent.doubleClick(excluded!);
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });
});
