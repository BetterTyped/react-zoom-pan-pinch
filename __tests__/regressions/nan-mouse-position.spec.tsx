/**
 * Regression tests for NaN propagation through mouse/touch position helpers.
 *
 * Two bugs allowed NaN coordinates to reach setState and silently skip
 * transform updates (printing "Detected NaN set state values" to console):
 *
 * 1. getMousePosition (wheel.utils.ts) detected NaN but still returned it.
 *    Fix: return { x: 0, y: 0 } as a safe fallback.
 *
 * 2. handleCalculateZoomPositions (zoom.utils.ts) guarded with
 *    `typeof !== "number"`, which passes for NaN (typeof NaN === "number").
 *    Fix: use Number.isFinite() which correctly rejects NaN and Infinity.
 *
 * Ref: https://github.com/BetterTyped/react-zoom-pan-pinch/pull/566
 */
import { fireEvent } from "@testing-library/react";

import { BoundsType } from "models/calculations.model";
import { getMousePosition } from "core/wheel/wheel.utils";
import { handleCalculateZoomPositions } from "core/zoom/zoom.utils";
import { ReactZoomPanPinchContext } from "models/context.model";

import { renderApp } from "../utils/render-app";

const makeNaNRect = (): DOMRect =>
  ({
    left: NaN,
    top: NaN,
    right: NaN,
    bottom: NaN,
    width: 0,
    height: 0,
    x: NaN,
    y: NaN,
    toJSON: () => ({}),
  }) as DOMRect;

const unboundedBounds: BoundsType = {
  minPositionX: -Infinity,
  maxPositionX: Infinity,
  minPositionY: -Infinity,
  maxPositionY: Infinity,
  scaleWidthFactor: 1,
  scaleHeightFactor: 1,
};

const makeContext = (
  positionX: number,
  positionY: number,
  scale: number,
): Pick<ReactZoomPanPinchContext, "state"> =>
  ({
    state: { scale, positionX, positionY, previousScale: scale },
  }) as Pick<ReactZoomPanPinchContext, "state">;

// ---------------------------------------------------------------------------
// Unit: getMousePosition
// ---------------------------------------------------------------------------

describe("getMousePosition — NaN guard (#566)", () => {
  it("returns {x:0,y:0} when getBoundingClientRect yields NaN coordinates", () => {
    const el = document.createElement("div");
    jest.spyOn(el, "getBoundingClientRect").mockReturnValue(makeNaNRect());

    const event = new WheelEvent("wheel", { clientX: 10, clientY: 10 });
    const result = getMousePosition(event, el as HTMLDivElement, 1);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("returns {x:0,y:0} on 0/0 NaN (clientX === contentRect.left, scale === 0)", () => {
    const el = document.createElement("div");
    jest.spyOn(el, "getBoundingClientRect").mockReturnValue({
      left: 5,
      top: 5,
      right: 5,
      bottom: 5,
      width: 0,
      height: 0,
      x: 5,
      y: 5,
      toJSON: () => ({}),
    } as DOMRect);

    // clientX === contentRect.left → numerator = 0; scale = 0 → 0 / 0 = NaN
    const event = new WheelEvent("wheel", { clientX: 5, clientY: 5 });
    const result = getMousePosition(event, el as HTMLDivElement, 0);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Unit: handleCalculateZoomPositions
// ---------------------------------------------------------------------------

describe("handleCalculateZoomPositions — Number.isFinite guard (#566)", () => {
  it("returns current position when mouseX is NaN (typeof NaN === 'number' bypassed the old guard)", () => {
    const ctx = makeContext(10, 20, 1);
    const result = handleCalculateZoomPositions(
      ctx as ReactZoomPanPinchContext,
      NaN,
      5,
      2,
      unboundedBounds,
      false,
    );
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });

  it("returns current position when mouseY is NaN", () => {
    const ctx = makeContext(10, 20, 1);
    const result = handleCalculateZoomPositions(
      ctx as ReactZoomPanPinchContext,
      5,
      NaN,
      2,
      unboundedBounds,
      false,
    );
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });

  it("returns current position when mouseX is Infinity", () => {
    const ctx = makeContext(10, 20, 1);
    const result = handleCalculateZoomPositions(
      ctx as ReactZoomPanPinchContext,
      Infinity,
      5,
      2,
      unboundedBounds,
      false,
    );
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });

  it("returns current position when mouseY is -Infinity", () => {
    const ctx = makeContext(10, 20, 1);
    const result = handleCalculateZoomPositions(
      ctx as ReactZoomPanPinchContext,
      5,
      -Infinity,
      2,
      unboundedBounds,
      false,
    );
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });
});

// ---------------------------------------------------------------------------
// Integration: wheel event with NaN cursor does not corrupt state
// ---------------------------------------------------------------------------

describe("Integration: wheel event with degenerate cursor position (#566)", () => {
  it("state stays finite after wheel event when contentComponent.getBoundingClientRect returns NaN", () => {
    const { content, ref } = renderApp({ minScale: 0.5 });

    const contentComponent = ref.current!.instance.contentComponent!;
    jest
      .spyOn(contentComponent, "getBoundingClientRect")
      .mockReturnValue(makeNaNRect());

    fireEvent(content, new WheelEvent("wheel", { bubbles: true, deltaY: -1 }));

    expect(Number.isFinite(ref.current!.instance.state.scale)).toBe(true);
    expect(Number.isFinite(ref.current!.instance.state.positionX)).toBe(true);
    expect(Number.isFinite(ref.current!.instance.state.positionY)).toBe(true);
  });

  it("scale stays finite after multiple wheel events with NaN cursor", () => {
    const { content, ref } = renderApp();

    const contentComponent = ref.current!.instance.contentComponent!;
    jest
      .spyOn(contentComponent, "getBoundingClientRect")
      .mockReturnValue(makeNaNRect());

    for (let i = 0; i < 10; i += 1) {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
      );
    }

    expect(Number.isFinite(ref.current!.instance.state.scale)).toBe(true);
    expect(Number.isFinite(ref.current!.instance.state.positionX)).toBe(true);
    expect(Number.isFinite(ref.current!.instance.state.positionY)).toBe(true);
  });
});
