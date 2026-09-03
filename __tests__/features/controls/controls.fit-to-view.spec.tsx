import { act } from "@testing-library/react";

import { ZoomPanPinch } from "../../../src/core/instance.core";
import { getControls } from "../../../src/utils/context.utils";
import { renderApp, flushAnimationFrames } from "../../utils";

const wrapper = { wrapperWidth: "500px", wrapperHeight: "500px" };
const wide = { ...wrapper, contentWidth: "2000px", contentHeight: "1000px" };
const small = { ...wrapper, contentWidth: "100px", contentHeight: "50px" };

/**
 * fitToView (#252): scale so the content fits (contain) or fills (cover) the
 * wrapper, centred. Honours the wrapper's minScale/maxScale.
 */
describe("fitToView control (#252)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("contain: shows the whole content, centred", async () => {
    const { ref, content } = renderApp({ ...wide, minScale: 0.1 });

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    // 2000x1000 into 500x500: min(0.25, 0.5) = 0.25 → 500x250, centred.
    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.25,
      positionX: 0,
      positionY: 125,
    });
    expect(content.style.transform).toBe("translate(0px, 125px) scale(0.25)");
  });

  it("cover: fills the viewport, centred", async () => {
    const { ref } = renderApp({ ...wide, minScale: 0.1 });

    await act(async () => {
      await ref.current!.fitToView({ mode: "cover", animationTime: 0 });
    });

    // max(0.25, 0.5) = 0.5 → 1000x500, centred horizontally.
    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.5,
      positionX: -250,
      positionY: 0,
    });
  });

  it("never shrinks below the wrapper's minScale (default 1: it only centres)", async () => {
    const { ref } = renderApp(wide);

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 1,
      positionX: -750,
      positionY: -250,
    });
  });

  it("upscales small content to fit", async () => {
    const { ref } = renderApp(small);

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    // 100x50 into 500x500: min(5, 10) = 5 → 500x250.
    expect(ref.current!.instance.state).toMatchObject({
      scale: 5,
      positionX: 0,
      positionY: 125,
    });
  });

  it("caps the fit scale with options.maxScale and raises it with options.minScale", async () => {
    const { ref } = renderApp(small);

    await act(async () => {
      await ref.current!.fitToView({ maxScale: 2, animationTime: 0 });
    });
    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: 150,
      positionY: 200,
    });

    await act(async () => {
      await ref.current!.fitToView({ minScale: 6, animationTime: 0 });
    });
    expect(ref.current!.instance.state).toMatchObject({
      scale: 6,
      positionX: -50,
      positionY: 100,
    });
  });

  it("never exceeds the wrapper's maxScale", async () => {
    const { ref } = renderApp({ ...small, maxScale: 3 });

    await act(async () => {
      await ref.current!.fitToView({ minScale: 10, animationTime: 0 });
    });

    expect(ref.current!.instance.state.scale).toBe(3);
  });

  it("fires the zoom callbacks and resolves once the animation is done", async () => {
    jest.useFakeTimers();
    const onZoomStart = jest.fn();
    const onZoom = jest.fn();
    const onZoomStop = jest.fn();
    const { ref } = renderApp({
      ...wide,
      minScale: 0.1,
      onZoomStart,
      onZoom,
      onZoomStop,
    });

    let promise!: Promise<void>;
    act(() => {
      promise = ref.current!.fitToView({ animationTime: 100 });
    });
    expect(onZoomStart).toHaveBeenCalledTimes(1);
    expect(onZoom).toHaveBeenCalledTimes(1);
    expect(onZoomStop).not.toHaveBeenCalled();

    await act(async () => {
      flushAnimationFrames(20);
    });
    await promise;

    expect(onZoomStop).toHaveBeenCalledTimes(1);
    expect(ref.current!.instance.state.scale).toBeCloseTo(0.25, 10);
  });

  it("applies immediately when zoomAnimation is disabled", () => {
    const { ref } = renderApp({
      ...wide,
      minScale: 0.1,
      zoomAnimation: { disabled: true },
    });

    act(() => {
      ref.current!.fitToView({ animationTime: 500 });
    });

    expect(ref.current!.instance.state.scale).toBe(0.25);
  });

  it("is a no-op when the wrapper is disabled", async () => {
    const { ref, content } = renderApp({
      ...wide,
      minScale: 0.1,
      disabled: true,
    });

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("is a no-op while the content has no size", async () => {
    const { ref, content } = renderApp({
      ...wrapper,
      contentWidth: "0px",
      contentHeight: "0px",
      minScale: 0.1,
    });

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("resolves before the components are mounted", async () => {
    const controls = getControls(new ZoomPanPinch({}));
    await expect(controls.fitToView()).resolves.toBeUndefined();
  });

  it("is exposed on the ref", () => {
    const { ref } = renderApp(wide);
    expect(typeof ref.current!.fitToView).toBe("function");
  });
});
