/**
 * Regression: clicking (mousedown → tiny mouse move → mouseup) after zooming
 * should NOT cause the viewport to fly away via velocity panning.
 *
 * Root cause: even a 1-2px accidental mouse movement during a click generates
 * non-zero velocity (total > 0.1). handlePanningEnd then triggers
 * handleVelocityPanning, which flings the viewport in the direction of the
 * tiny movement with inertia — appearing as a fast pan to a corner.
 *
 * Fix: require a minimum displacement threshold before treating a
 * mousedown→mouseup as a real pan gesture.
 */
import { act, fireEvent } from "@testing-library/react";
import { renderApp, flushAnimationFrames, DEFAULT_MS_PER_STEP } from "../utils/render-app";

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

function parseTransform(transform: string) {
  const m = transform.match(
    /translate\(([^p]+)px,\s*([^p]+)px\)\s*scale\(([^)]+)\)/,
  );
  if (!m) throw new Error(`Cannot parse transform: ${transform}`);
  return {
    x: parseFloat(m[1]),
    y: parseFloat(m[2]),
    scale: parseFloat(m[3]),
  };
}

describe("click-after-zoom snap regression", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("tiny mouse movement during click must not trigger velocity panning", () => {
    const { content, wrapper, zoom, ref } = renderApp({
      limitToBounds: true,
      doubleClick: { disabled: true },
      velocityAnimation: { disabled: false },
    });

    mockDimensions(wrapper, 500, 500);
    mockDimensions(content, 500, 500);

    // Zoom in then out
    act(() => {
      zoom({ value: 4, center: [250, 250] });
    });
    act(() => {
      flushAnimationFrames();
    });
    act(() => {
      zoom({ value: 2, center: [250, 250] });
    });
    act(() => {
      flushAnimationFrames();
    });

    const settled = parseTransform(content.style.transform);

    // Simulate a "click" with tiny accidental mouse jitter.
    // Two moves are needed so the velocity calculation has a previous sample.
    act(() => {
      fireEvent.mouseDown(content, { clientX: 200, clientY: 200, buttons: 1 });
    });
    act(() => {
      jest.advanceTimersByTime(8);
      fireEvent.mouseMove(content, { clientX: 201, clientY: 201, buttons: 1 });
    });
    act(() => {
      jest.advanceTimersByTime(8);
      fireEvent.mouseMove(content, { clientX: 203, clientY: 204, buttons: 1 });
    });
    act(() => {
      fireEvent.mouseUp(content, { clientX: 203, clientY: 204 });
    });
    act(() => {
      flushAnimationFrames();
    });

    const afterClick = parseTransform(content.style.transform);

    // Direct mouse displacement is ~7px; the bug caused 129px+ velocity snap
    const drift =
      Math.abs(afterClick.x - settled.x) + Math.abs(afterClick.y - settled.y);
    expect(drift).toBeLessThan(10);
  });

  it("tiny mouse movement during click must not trigger velocity panning (with autoAlignment)", () => {
    const { content, wrapper, zoom } = renderApp({
      limitToBounds: true,
      doubleClick: { disabled: true },
      velocityAnimation: { disabled: false },
      autoAlignment: { disabled: false },
    });

    mockDimensions(wrapper, 500, 500);
    mockDimensions(content, 500, 500);

    act(() => {
      zoom({ value: 4, center: [250, 250] });
    });
    act(() => {
      flushAnimationFrames();
    });
    act(() => {
      zoom({ value: 2, center: [250, 250] });
    });
    act(() => {
      flushAnimationFrames();
    });

    const settled = parseTransform(content.style.transform);

    // Click with tiny jitter — two moves so velocity gets a sample
    act(() => {
      fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    });
    act(() => {
      jest.advanceTimersByTime(8);
      fireEvent.mouseMove(content, { clientX: 101, clientY: 101, buttons: 1 });
    });
    act(() => {
      jest.advanceTimersByTime(8);
      fireEvent.mouseMove(content, { clientX: 103, clientY: 102, buttons: 1 });
    });
    act(() => {
      fireEvent.mouseUp(content, { clientX: 103, clientY: 102 });
    });
    act(() => {
      flushAnimationFrames();
    });

    const afterClick = parseTransform(content.style.transform);
    const drift =
      Math.abs(afterClick.x - settled.x) + Math.abs(afterClick.y - settled.y);
    expect(drift).toBeLessThan(10);
  });

  it("real pan gesture (larger movement) still works", () => {
    const { content, wrapper, zoom, pan } = renderApp({
      limitToBounds: false,
      doubleClick: { disabled: true },
      velocityAnimation: { disabled: false },
    });

    mockDimensions(wrapper, 500, 500);
    mockDimensions(content, 500, 500);

    act(() => {
      zoom({ value: 3, center: [250, 250] });
    });
    act(() => {
      flushAnimationFrames();
    });

    const afterZoom = parseTransform(content.style.transform);

    // Real pan with substantial movement
    act(() => {
      pan({ x: -80, y: -40, moveEventCount: 5 });
    });
    act(() => {
      flushAnimationFrames();
    });

    const afterPan = parseTransform(content.style.transform);
    const moved =
      Math.abs(afterPan.x - afterZoom.x) > 5 ||
      Math.abs(afterPan.y - afterZoom.y) > 5;
    expect(moved).toBe(true);
  });
});
