import { act } from "@testing-library/react";

import { ZoomPanPinch } from "../../../src/core/instance.core";
import { getControls } from "../../../src/utils/context.utils";
import { renderApp, flushAnimationFrames } from "../../utils";

const size = {
  wrapperWidth: "500px",
  wrapperHeight: "500px",
  contentWidth: "1000px",
  contentHeight: "1000px",
};

const frames = (n: number) => {
  for (let i = 0; i < n; i += 1) {
    jest.advanceTimersByTime(16);
  }
};

/**
 * panBy (#254, #527): pan by a pixel delta, bounded like a gesture.
 */
describe("panBy control", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("moves by the delta", async () => {
    const { ref, content } = renderApp(size);

    act(() => {
      ref.current!.setTransform(-100, -100, 1, 0);
    });
    await act(async () => {
      await ref.current!.panBy(30, -20, 0);
    });

    expect(content.style.transform).toBe("translate(-70px, -120px) scale(1)");
  });

  it("is clamped to the pan bounds", async () => {
    const { ref } = renderApp(size);

    await act(async () => {
      await ref.current!.panBy(100, 100, 0);
    });
    // Content 1000 in a 500 wrapper: positions are limited to [-500, 0].
    expect(ref.current!.instance.state).toMatchObject({
      positionX: 0,
      positionY: 0,
    });

    await act(async () => {
      await ref.current!.panBy(-10000, -10000, 0);
    });
    expect(ref.current!.instance.state).toMatchObject({
      positionX: -500,
      positionY: -500,
    });
  });

  it("uses the bounds of the current scale", async () => {
    const { ref } = renderApp(size);

    act(() => {
      ref.current!.setTransform(0, 0, 2, 0);
    });
    await act(async () => {
      await ref.current!.panBy(-10000, 0, 0);
    });

    // 1000 * 2 = 2000 wide in a 500 wrapper → min position -1500.
    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: -1500,
      positionY: 0,
    });
  });

  it("ignores the bounds when limitToBounds is off", async () => {
    const { ref } = renderApp({ ...size, limitToBounds: false });

    await act(async () => {
      await ref.current!.panBy(100, 50, 0);
    });

    expect(ref.current!.instance.state).toMatchObject({
      positionX: 100,
      positionY: 50,
    });
  });

  it("does not fire callbacks when the move is fully clamped away", async () => {
    const onPanningStart = jest.fn();
    const { ref } = renderApp({ ...size, onPanningStart });

    await act(async () => {
      await ref.current!.panBy(50, 0, 0);
    });

    expect(onPanningStart).not.toHaveBeenCalled();
    expect(ref.current!.instance.state.positionX).toBe(0);
  });

  it("fires onPanningStart, onPanning and onPanningStop", () => {
    jest.useFakeTimers();
    const onPanningStart = jest.fn();
    const onPanning = jest.fn();
    const onPanningStop = jest.fn();
    const { ref } = renderApp({
      ...size,
      onPanningStart,
      onPanning,
      onPanningStop,
    });

    act(() => {
      ref.current!.panBy(-10, 0, 50);
    });
    expect(onPanningStart).toHaveBeenCalledTimes(1);
    expect(onPanning).toHaveBeenCalledTimes(1);
    expect(onPanningStop).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(onPanningStop).toHaveBeenCalledTimes(1);
  });

  it("animates and resolves with the final position", async () => {
    jest.useFakeTimers();
    const { ref } = renderApp(size);

    let promise!: Promise<void>;
    act(() => {
      promise = ref.current!.panBy(-200, -100, 200);
    });
    await act(async () => {
      frames(2);
    });
    const midway = ref.current!.instance.state.positionX;
    expect(midway).toBeLessThan(0);
    expect(midway).toBeGreaterThan(-200);

    await act(async () => {
      flushAnimationFrames(30);
    });
    await promise;

    expect(ref.current!.instance.state).toMatchObject({
      positionX: -200,
      positionY: -100,
      scale: 1,
    });
  });

  it("is a no-op when the wrapper is disabled", async () => {
    const { ref } = renderApp({
      ...size,
      disabled: true,
      limitToBounds: false,
    });

    await act(async () => {
      await ref.current!.panBy(10, 10, 0);
    });

    expect(ref.current!.instance.state.positionX).toBe(0);
  });

  it("ignores non-finite deltas", async () => {
    const { ref } = renderApp({ ...size, limitToBounds: false });

    await act(async () => {
      await ref.current!.panBy(Number.NaN, 10, 0);
      await ref.current!.panBy(Number.POSITIVE_INFINITY, 0, 0);
    });

    expect(ref.current!.instance.state).toMatchObject({
      positionX: 0,
      positionY: 0,
    });
  });

  it("resolves before the components are mounted", async () => {
    const controls = getControls(new ZoomPanPinch({}));
    await expect(controls.panBy(10, 10)).resolves.toBeUndefined();
  });
});
