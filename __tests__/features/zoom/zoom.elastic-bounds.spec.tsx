import { act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../../utils";

function fireTrackpadWheel(target: HTMLElement, deltaY: number, count: number) {
  for (let i = 0; i < count; i += 1) {
    fireEvent(
      target,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY,
        ctrlKey: true,
      }),
    );
  }
}

function fireMouseWheel(target: HTMLElement, deltaY: number, count: number) {
  for (let i = 0; i < count; i += 1) {
    fireEvent(
      target,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY,
        ctrlKey: false,
      }),
    );
  }
}

describe("Zoom [Elastic bounds / rubberband]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("trackpad pinch (ctrlKey + wheel) allows elastic overshoot", () => {
    it("should allow scale to temporarily go below minScale during gesture", () => {
      const { content, ref } = renderApp({
        minScale: 0.5,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      fireTrackpadWheel(content, 50, 30);

      expect(ref.current!.instance.state.scale).toBeLessThan(0.5);
    });

    it("should allow scale to temporarily go above maxScale during gesture", () => {
      const { content, ref } = renderApp({
        maxScale: 3,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      fireTrackpadWheel(content, -50, 30);

      expect(ref.current!.instance.state.scale).toBeGreaterThan(3);
    });

    it("should snap back to minScale after gesture ends (zoom out)", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        minScale: 0.5,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      fireTrackpadWheel(content, 50, 30);

      const scaleDuringGesture = ref.current!.instance.state.scale;
      expect(scaleDuringGesture).toBeLessThan(0.5);

      act(() => {
        jest.advanceTimersByTime(300);
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
    });

    it("should snap back to maxScale after gesture ends (zoom in)", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        maxScale: 3,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      fireTrackpadWheel(content, -50, 30);

      const scaleDuringGesture = ref.current!.instance.state.scale;
      expect(scaleDuringGesture).toBeGreaterThan(3);

      act(() => {
        jest.advanceTimersByTime(300);
        flushAnimationFrames(60);
      });

      expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(3);
    });

    it("overshoot is bounded by zoomAnimation.size padding", () => {
      const zoomPadding = 0.4;
      const { content, ref } = renderApp({
        minScale: 1,
        maxScale: 3,
        wheel: { step: 0.2 },
        zoomAnimation: { size: zoomPadding },
      });

      userEvent.hover(content);
      fireTrackpadWheel(content, 50, 100);

      const { scale } = ref.current!.instance.state;
      expect(scale).toBeGreaterThanOrEqual(1 - zoomPadding);
    });
  });

  describe("regular mouse wheel does NOT allow elastic overshoot", () => {
    it("should hard-clamp at minScale during wheel zoom out", () => {
      const { content, ref } = renderApp({
        minScale: 0.5,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      for (let i = 0; i < 30; i += 1) {
        fireMouseWheel(content, 50, 1);
        expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
      }
    });

    it("should hard-clamp at maxScale during wheel zoom in", () => {
      const { content, ref } = renderApp({
        maxScale: 3,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      for (let i = 0; i < 30; i += 1) {
        fireMouseWheel(content, -50, 1);
        expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("disablePadding prevents elastic overshoot", () => {
    it("should hard-clamp at minScale even for trackpad pinch", () => {
      const { content, ref } = renderApp({
        minScale: 0.5,
        disablePadding: true,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      for (let i = 0; i < 30; i += 1) {
        fireTrackpadWheel(content, 50, 1);
        expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
      }
    });

    it("should hard-clamp at maxScale even for trackpad pinch", () => {
      const { content, ref } = renderApp({
        maxScale: 3,
        disablePadding: true,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      for (let i = 0; i < 30; i += 1) {
        fireTrackpadWheel(content, -50, 1);
        expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("zoomAnimation.disabled prevents elastic overshoot", () => {
    it("should hard-clamp when zoomAnimation is disabled", () => {
      const { content, ref } = renderApp({
        minScale: 0.5,
        zoomAnimation: { disabled: true },
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      for (let i = 0; i < 30; i += 1) {
        fireTrackpadWheel(content, 50, 1);
        expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
      }
    });
  });
});
