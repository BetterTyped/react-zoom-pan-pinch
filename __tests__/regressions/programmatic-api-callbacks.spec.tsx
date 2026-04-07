import { act, waitFor } from "@testing-library/react";

import { ReactZoomPanPinchRef } from "../../src";
import { renderApp, flushAnimationFrames } from "../utils";

function assertStableRefAPI(ctx: ReactZoomPanPinchRef | null) {
  expect(ctx).not.toBeNull();
  expect(ctx!.state).toBeDefined();
  expect(ctx!.instance).toBeDefined();
  expect(typeof ctx!.zoomIn).toBe("function");
  expect(typeof ctx!.zoomOut).toBe("function");
  expect(typeof ctx!.resetTransform).toBe("function");
  expect(typeof ctx!.centerView).toBe("function");
  expect(typeof ctx!.setTransform).toBe("function");
  expect(typeof ctx!.zoomToElement).toBe("function");
}

describe("programmatic API callbacks regressions", () => {
  it("imperative zoomIn fires onZoomStart, onZoom, and onZoomStop (Ref #369)", async () => {
    jest.useFakeTimers();
    const onZoomStart = jest.fn();
    const onZoom = jest.fn();
    const onZoomStop = jest.fn();
    const { ref } = renderApp({
      onZoomStart,
      onZoom,
      onZoomStop,
    });

    act(() => {
      ref.current!.zoomIn();
    });

    await act(async () => {
      flushAnimationFrames();
    });

    expect(onZoomStart).toHaveBeenCalled();
    expect(onZoom).toHaveBeenCalled();
    expect(onZoomStop).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("onPanning keeps firing after DOM mutation inside content (Ref #432)", () => {
    const onPanning = jest.fn();
    const { content, pan } = renderApp({ onPanning });

    pan({ x: 40, y: 20, moveEventCount: 4 });
    const callsBeforeMutation = onPanning.mock.calls.length;
    expect(callsBeforeMutation).toBeGreaterThan(0);

    const col = document.createElement("div");
    col.textContent = "new column";
    content.appendChild(col);

    onPanning.mockClear();
    pan({
      x: 40,
      y: 20,
      moveEventCount: 4,
      from: { clientX: 50, clientY: 50 },
    });

    expect(onPanning).toHaveBeenCalled();
  });

  it("resetTransform restores initialPosition and initialScale (Ref #286)", async () => {
    jest.useFakeTimers();
    const { ref, pan } = renderApp({
      initialPositionX: 50,
      initialPositionY: 50,
      initialScale: 1.5,
      limitToBounds: false,
    });
    const initial = { ...ref.current!.instance.state };

    pan({ x: 35, y: -20, moveEventCount: 4 });
    expect(ref.current!.instance.state.positionX).not.toBe(initial.positionX);

    act(() => {
      ref.current!.resetTransform();
    });

    await act(async () => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.state.scale).toBeCloseTo(initial.scale, 5);
    expect(ref.current!.instance.state.positionX).toBeCloseTo(
      initial.positionX,
      3,
    );
    expect(ref.current!.instance.state.positionY).toBeCloseTo(
      initial.positionY,
      3,
    );

    jest.useRealTimers();
  });

  it("ref API exposes stable handlers and state before and after zoom (Ref #553)", async () => {
    const { ref, zoom } = renderApp();

    assertStableRefAPI(ref.current);
    const scaleBefore = ref.current!.instance.state.scale;

    zoom({ value: 2 });
    await waitFor(() => {
      expect(ref.current!.instance.state.scale).toBe(2);
    });

    assertStableRefAPI(ref.current);
    expect(ref.current!.instance.state.scale).not.toBe(scaleBefore);
    expect(ref.current!.state.scale).toBe(2);
  });
});
