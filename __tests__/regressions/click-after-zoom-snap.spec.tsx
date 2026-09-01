/**
 * Regression: clicking (mousedown → tiny mouse move → mouseup) after zooming
 * should NOT cause the viewport to fly away via velocity panning.
 *
 * Root cause: even a 1-2px accidental mouse movement during a click generates
 * non-zero velocity (total > 0.1). handlePanningEnd then triggers
 * handleVelocityPanning, which flings the viewport in the direction of the
 * tiny movement with inertia — appearing as a fast pan to a corner.
 *
 * Fix: require a minimum displacement (5px, i.e. dx² + dy² > 25) before a
 * mousedown→mouseup counts as a real pan gesture. Both sides of that
 * threshold are pinned below.
 */
import { act, fireEvent } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../utils/render-app";

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

const setupZoomed = () => {
  const app = renderApp({
    limitToBounds: true,
    doubleClick: { disabled: true },
    velocityAnimation: { disabled: false },
  });
  mockDimensions(app.wrapper, 500, 500);
  mockDimensions(app.content, 500, 500);

  act(() => {
    app.zoom({ value: 4, center: [250, 250] });
  });
  act(() => {
    flushAnimationFrames();
  });
  act(() => {
    app.zoom({ value: 2, center: [250, 250] });
  });
  act(() => {
    flushAnimationFrames();
  });
  return app;
};

/** mousedown at (200, 200), two timed moves, mouseup at the last point. */
const clickWithJitter = (
  content: HTMLElement,
  first: [number, number],
  second: [number, number],
) => {
  act(() => {
    fireEvent.mouseDown(content, { clientX: 200, clientY: 200, buttons: 1 });
  });
  act(() => {
    jest.advanceTimersByTime(8);
    fireEvent.mouseMove(content, {
      clientX: first[0],
      clientY: first[1],
      buttons: 1,
    });
  });
  act(() => {
    jest.advanceTimersByTime(8);
    fireEvent.mouseMove(content, {
      clientX: second[0],
      clientY: second[1],
      buttons: 1,
    });
  });
  act(() => {
    fireEvent.mouseUp(content, { clientX: second[0], clientY: second[1] });
  });
  act(() => {
    flushAnimationFrames();
  });
};

describe("click-after-zoom snap regression", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("tiny mouse movement during click moves the content by exactly that jitter, with no inertia", () => {
    const { content } = setupZoomed();
    const settled = parseTransform(content.style.transform);

    // Total displacement (2, 3): well inside the 5px threshold.
    clickWithJitter(content, [201, 201], [202, 203]);

    const afterClick = parseTransform(content.style.transform);
    expect(afterClick.x - settled.x).toBeCloseTo(2, 5);
    expect(afterClick.y - settled.y).toBeCloseTo(3, 5);
  });

  it("a displacement past the threshold does fling the content with inertia", () => {
    const { content, ref } = setupZoomed();
    const settled = parseTransform(content.style.transform);

    // Total displacement (8, 8): dx² + dy² = 128 > 25.
    clickWithJitter(content, [204, 204], [208, 208]);

    const afterFlick = parseTransform(content.style.transform);
    expect(afterFlick.x - settled.x).toBeGreaterThan(8 + 5);
    expect(afterFlick.y - settled.y).toBeGreaterThan(8 + 5);
    expect(ref.current!.instance.isAnimating).toBe(false);
  });

  it("a real pan gesture keeps moving in the drag direction after release", () => {
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

    act(() => {
      pan({ x: -80, y: -40, moveEventCount: 5 });
    });
    const atRelease = parseTransform(content.style.transform);

    act(() => {
      flushAnimationFrames();
    });
    const afterInertia = parseTransform(content.style.transform);

    // Inertia carries the content further than the pointer travelled.
    expect(afterInertia.x).toBeLessThan(atRelease.x - 5);
    expect(afterInertia.y).toBeLessThan(atRelease.y - 5);
  });
});
