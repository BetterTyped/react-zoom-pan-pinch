import { act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../utils";

const wheel = (
  target: Element,
  init: WheelEventInit & { deltaY: number },
): void => {
  fireEvent(target, new WheelEvent("wheel", { bubbles: true, ...init }));
};

describe("regressions: wheel and zoom behavior", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Ref #241", () => {
    it("double-click toggle zooms in by step and back out to 1 (Ref #241)", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        doubleClick: {
          disabled: false,
          mode: "toggle",
          step: 0.7,
          animationTime: 80,
        },
      });

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });
      // Without this midpoint a disabled double-click would also "pass".
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.7, 5);

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1, 5);
    });
  });

  describe("Ref #323", () => {
    it("wheel zoom respects activationKeys (Ref #323)", () => {
      const { content, ref } = renderApp({
        wheel: { activationKeys: ["Control"] },
      });

      userEvent.hover(content);
      wheel(content, { deltaY: -5 });
      expect(ref.current!.instance.state.scale).toBe(1);

      wheel(content, { deltaY: -5, ctrlKey: true });
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("Ref #404", () => {
    it("ctrl+wheel with pixel deltas (trackpad pinch) zooms with the default props (Ref #404)", () => {
      const { content, ref } = renderApp();

      userEvent.hover(content);
      wheel(content, { deltaY: -4.5, ctrlKey: true, deltaMode: 0 });

      // smooth mode: step * |deltaY| = 0.015 * 4.5
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.0675, 5);
    });

    it("scales the zoom step with the trackpad delta magnitude (Ref #404)", () => {
      const small = renderApp();
      userEvent.hover(small.content);
      wheel(small.content, { deltaY: -1, ctrlKey: true, deltaMode: 0 });
      const smallScale = small.ref.current!.instance.state.scale;
      small.unmount();

      const large = renderApp();
      userEvent.hover(large.content);
      wheel(large.content, { deltaY: -10, ctrlKey: true, deltaMode: 0 });
      const largeScale = large.ref.current!.instance.state.scale;

      expect(smallScale).toBeCloseTo(1.015, 5);
      expect(largeScale).toBeCloseTo(1.15, 5);
    });

    it("wheel.touchPadDisabled opts out of ctrl+wheel zoom (Ref #404)", () => {
      const { content, ref } = renderApp({
        wheel: { touchPadDisabled: true },
      });

      userEvent.hover(content);
      wheel(content, { deltaY: -40, ctrlKey: true, deltaMode: 0 });

      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("Ref #406", () => {
    // jsdom derives getBoundingClientRect from inline styles only, so the
    // content rect never moves with the transform. That makes the anchor
    // math exact for the first wheel event only; later events cannot be
    // verified faithfully here.
    it("wheel zoom anchors on the cursor: position = -cursor * (newScale - scale) (Ref #406)", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { step: 0.2 },
        limitToBounds: false,
      });

      userEvent.hover(content);
      wheel(content, { deltaY: -10, clientX: 400, clientY: 300 });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.2, 10);
      expect(ref.current!.instance.state.positionX).toBeCloseTo(-80, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(-60, 5);
    });

    it("consecutive wheel events add exactly one step each, no overshoot (Ref #406)", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { step: 0.2 },
        limitToBounds: false,
      });

      userEvent.hover(content);
      const scales: number[] = [];
      for (let i = 0; i < 4; i += 1) {
        wheel(content, { deltaY: -10, clientX: 400, clientY: 300 });
        scales.push(ref.current!.instance.state.scale);
      }

      expect(scales.map((s) => Number(s.toFixed(10)))).toEqual([
        1.2, 1.4, 1.6, 1.8,
      ]);
    });
  });

  describe("Ref #431", () => {
    it("zoomIn(step) adds the step under the default props (Ref #431)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp();

      act(() => {
        ref.current!.zoomIn(0.5, 200, "easeOut");
      });
      act(() => {
        flushAnimationFrames(80);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);

      // From a non-1 scale an exponential step would give 1.5 * e^0.5 = 2.47.
      act(() => {
        ref.current!.zoomIn(0.5, 200, "easeOut");
      });
      act(() => {
        flushAnimationFrames(80);
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(2, 10);
    });
  });

  describe("Ref #438", () => {
    const zoomOutHard = (content: HTMLElement) => {
      userEvent.hover(content);
      wheel(content, { deltaY: -20, ctrlKey: true });
      for (let i = 0; i < 40; i += 1) {
        wheel(content, { deltaY: 50, ctrlKey: true });
      }
    };

    it("ctrl+wheel zoom-out may stretch below minScale by zoomAnimation.size during the gesture and settles back exactly on minScale (Ref #438, elastic by design)", () => {
      jest.useFakeTimers();
      const seen: number[] = [];
      const { content, ref } = renderApp({
        minScale: 0.5,
        smooth: false,
        wheel: { step: 0.2 },
        zoomAnimation: { size: 0.4 },
        onTransform: (_, state) => {
          seen.push(state.scale);
        },
      });

      zoomOutHard(content);

      // The rubber band is bounded by zoomAnimation.size...
      expect(Math.min(...seen)).toBeGreaterThanOrEqual(0.5 - 0.4);
      // ...and it is genuinely used during the gesture.
      expect(Math.min(...seen)).toBeLessThan(0.5);

      act(() => {
        jest.advanceTimersByTime(200);
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(0.5, 5);
    });

    it("with disablePadding the scale never drops below minScale, not even mid-gesture (Ref #438)", () => {
      jest.useFakeTimers();
      const seen: number[] = [];
      const { content, ref } = renderApp({
        minScale: 0.5,
        smooth: false,
        disablePadding: true,
        wheel: { step: 0.2 },
        onTransform: (_, state) => {
          seen.push(state.scale);
        },
      });

      zoomOutHard(content);

      expect(seen.length).toBeGreaterThan(0);
      expect(Math.min(...seen)).toBeGreaterThanOrEqual(0.5);
      expect(ref.current!.instance.state.scale).toBe(0.5);
    });
  });

  describe("Ref #463", () => {
    // wrapper 500 x 500, content 100 % => 375 x 375 at scale 0.75, so the
    // centered position is (62.5, 62.5) and the free range is [0, 125].
    it("centerZoomedOut false keeps the panned position when zoomed below 1 (Ref #463)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        centerZoomedOut: false,
        minScale: 0.5,
        limitToBounds: true,
        velocityAnimation: { disabled: true },
      });

      act(() => {
        ref.current!.setTransform(0, 0, 0.75, 0, "easeOut");
      });

      pan({ x: 80, y: 60, moveEventCount: 1 });

      expect(ref.current!.instance.state.positionX).toBeCloseTo(80, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(60, 5);

      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(100);
      });

      expect(ref.current!.instance.state.positionX).toBeCloseTo(80, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(60, 5);
    });

    it("centerZoomedOut true snaps the same pan back to the center (Ref #463, mirror case)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        centerZoomedOut: true,
        minScale: 0.5,
        limitToBounds: true,
        velocityAnimation: { disabled: true },
      });

      act(() => {
        ref.current!.setTransform(0, 0, 0.75, 0, "easeOut");
      });

      pan({ x: 80, y: 60, moveEventCount: 1 });

      expect(ref.current!.instance.state.positionX).toBeCloseTo(62.5, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(62.5, 5);
    });
  });

  describe("state precision", () => {
    it("setState stores scale and position without rounding", () => {
      const { ref } = renderApp();

      const preciseScale = 1.23456789;
      const preciseX = 42.123456789;
      const preciseY = -17.987654321;

      ref.current!.instance.setState(preciseScale, preciseX, preciseY);

      expect(ref.current!.instance.state.scale).toBe(preciseScale);
      expect(ref.current!.instance.state.positionX).toBe(preciseX);
      expect(ref.current!.instance.state.positionY).toBe(preciseY);
    });

    it("wheel zoom accumulates small deltas without rounding drift", () => {
      const { content, ref } = renderApp({ limitToBounds: false });

      userEvent.hover(content);
      for (let i = 0; i < 20; i += 1) {
        wheel(content, { deltaY: -0.7, ctrlKey: true, clientX: 0, clientY: 0 });
      }

      // 20 events * 0.015 * 0.7 added linearly.
      expect(ref.current!.instance.state.scale).toBeCloseTo(
        1 + 20 * 0.0105,
        10,
      );
    });
  });

  describe("Ref #495", () => {
    it("wheel.step changes zoom sensitivity (Ref #495)", () => {
      const run = (step: number) => {
        const { content, ref, unmount } = renderApp({
          smooth: false,
          wheel: { step },
        });
        userEvent.hover(content);
        for (let i = 0; i < 6; i += 1) {
          wheel(content, { deltaY: -8 });
        }
        const { scale } = ref.current!.instance.state;
        unmount();
        return scale;
      };

      expect(run(0.02)).toBeCloseTo(1.12, 10);
      expect(run(0.12)).toBeCloseTo(1.72, 10);
    });
  });
});
