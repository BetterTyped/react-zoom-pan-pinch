import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";

import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "../../src";
import { renderApp, flushAnimationFrames } from "../utils";
import { parseTransform } from "../utils/parsing";

const HANDLER_KEYS = [
  "zoomIn",
  "zoomOut",
  "resetTransform",
  "centerView",
  "setTransform",
  "zoomToElement",
  "zoomToPoint",
  "clientToContent",
  "contentToClient",
  "fitToView",
  "panBy",
];

function assertStableRefAPI(ctx: ReactZoomPanPinchRef | null) {
  expect(ctx).not.toBeNull();
  expect(ctx!.state).toBeDefined();
  expect(ctx!.instance).toBeDefined();
  HANDLER_KEYS.forEach((key) => {
    expect(typeof (ctx as unknown as Record<string, unknown>)[key]).toBe(
      "function",
    );
  });
}

describe("programmatic API callbacks regressions", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Ref #369", () => {
    it("imperative zoomIn fires onZoomStart, onZoom, onZoomStop and changes the scale (Ref #369)", () => {
      jest.useFakeTimers();
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { ref } = renderApp({ onZoomStart, onZoom, onZoomStop });

      act(() => {
        ref.current!.zoomIn();
      });
      act(() => {
        flushAnimationFrames();
      });

      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      expect(onZoomStop).toHaveBeenCalledTimes(1);
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);
    });

    it("imperative zoomOut and resetTransform fire the zoom callbacks (Ref #369)", () => {
      jest.useFakeTimers();
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { ref } = renderApp({
        initialScale: 2,
        onZoomStart,
        onZoom,
        onZoomStop,
      });

      act(() => {
        ref.current!.zoomOut();
      });
      act(() => {
        flushAnimationFrames();
      });
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);
      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      expect(onZoomStop).toHaveBeenCalledTimes(1);

      act(() => {
        ref.current!.resetTransform();
      });
      act(() => {
        flushAnimationFrames();
      });
      expect(ref.current!.instance.state.scale).toBe(2);
      expect(onZoomStart).toHaveBeenCalledTimes(2);
      expect(onZoom).toHaveBeenCalledTimes(2);
      expect(onZoomStop).toHaveBeenCalledTimes(2);
    });

    it("double-click zoom fires the zoom callbacks (Ref #369, dupes #259, #305)", () => {
      jest.useFakeTimers();
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { content, ref } = renderApp({
        doubleClick: { disabled: false, animationTime: 100 },
        onZoomStart,
        onZoom,
        onZoomStop,
      });

      act(() => {
        fireEvent.doubleClick(content, { clientX: 10, clientY: 10 });
      });
      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      expect(onZoomStop).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ref #432", () => {
    it("onPanning reports a consistent, monotonically updated state on every move (Ref #432)", () => {
      const seenX: number[] = [];
      const onPanning = jest.fn((ctx: ReactZoomPanPinchRef) => {
        seenX.push(ctx.state.positionX);
      });
      const { content, pan } = renderApp({ onPanning });

      pan({ x: 40, y: 20, moveEventCount: 4 });

      expect(seenX).toEqual([10, 20, 30, 40]);
      expect(parseTransform(content.style.transform).translate).toBe(
        "40px, 20px",
      );
    });

    it("onPanning keeps reporting correct positions after the content DOM changes (Ref #432)", () => {
      const seenX: number[] = [];
      const onPanning = jest.fn((ctx: ReactZoomPanPinchRef) => {
        seenX.push(ctx.state.positionX);
      });
      const { content, pan } = renderApp({ onPanning });

      pan({ x: 40, y: 20, moveEventCount: 4 });
      seenX.length = 0;

      const col = document.createElement("div");
      col.textContent = "new column";
      content.appendChild(col);

      pan({
        x: 40,
        y: 20,
        moveEventCount: 4,
        from: { clientX: 50, clientY: 50 },
      });

      expect(seenX).toEqual([50, 60, 70, 80]);
    });
  });

  describe("Ref #286", () => {
    it("resetTransform restores the literal initialPosition and initialScale (Ref #286)", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        initialPositionX: 50,
        initialPositionY: 50,
        initialScale: 1.5,
        limitToBounds: false,
      });

      pan({ x: 35, y: -20, moveEventCount: 4 });
      expect(ref.current!.instance.state.positionX).toBe(85);

      act(() => {
        ref.current!.resetTransform();
      });
      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);
      expect(ref.current!.instance.state.positionX).toBeCloseTo(50, 10);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(50, 10);
    });

    it("resetTransform returns to the centered position when centerOnInit is set (Ref #286)", () => {
      jest.useFakeTimers();
      const { ref, pan } = renderApp({
        centerOnInit: true,
        contentWidth: "1000px",
        contentHeight: "1000px",
      });
      // wrapper 500 x 500, content 1000 x 1000 => centered at (-250, -250)
      expect(ref.current!.instance.state.positionX).toBe(-250);
      expect(ref.current!.instance.state.positionY).toBe(-250);

      pan({ x: -60, y: -40, moveEventCount: 2 });
      expect(ref.current!.instance.state.positionX).toBe(-310);

      act(() => {
        ref.current!.resetTransform();
      });
      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.positionX).toBeCloseTo(-250, 10);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(-250, 10);
    });
  });

  describe("Ref #553", () => {
    it("the ref has the same shape at every timing: render prop, onInit and after mount (Ref #553)", () => {
      const seen: Record<string, string[]> = {};
      const ref = React.createRef<ReactZoomPanPinchContentRef>();

      render(
        <TransformWrapper
          ref={ref}
          onInit={(ctx) => {
            seen.onInit = Object.keys(ctx).sort();
          }}
        >
          {(ctx) => {
            seen.renderProp = Object.keys(ctx).sort();
            return (
              <TransformComponent>
                <div />
              </TransformComponent>
            );
          }}
        </TransformWrapper>,
      );
      seen.ref = Object.keys(ref.current!).sort();

      const expected = ["instance", "state", ...HANDLER_KEYS].sort();
      expect(seen.renderProp).toEqual(expected);
      expect(seen.onInit).toEqual(expected);
      expect(seen.ref).toEqual(expected);
      expect("transformState" in ref.current!.instance).toBe(false);
    });

    it("ref.state is the live transform state, shared with instance.state (Ref #553)", async () => {
      const { ref, zoom } = renderApp();

      assertStableRefAPI(ref.current);
      expect(ref.current!.state).toBe(ref.current!.instance.state);

      zoom({ value: 2 });
      await waitFor(() => {
        expect(ref.current!.instance.state.scale).toBe(2);
      });

      assertStableRefAPI(ref.current);
      expect(ref.current!.state.scale).toBe(2);
    });
  });
});
