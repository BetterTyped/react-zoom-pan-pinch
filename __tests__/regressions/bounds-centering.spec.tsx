import { waitFor, fireEvent } from "@testing-library/react";

import { renderApp } from "../utils";

const NativeResizeObserver = global.ResizeObserver;

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
});

afterAll(() => {
  global.ResizeObserver = NativeResizeObserver;
});

describe("bounds and centering regressions", () => {
  it("maxPositionX clamps horizontal pan when set (Ref #250)", () => {
    const { pan, ref } = renderApp({
      maxPositionX: 50,
      limitToBounds: true,
      disablePadding: true,
    });
    // At scale=2 the bound scales to 50*2=100 (wrapperWidth=0 in jsdom)
    ref.current!.setTransform(0, 0, 2, 0);
    pan({ x: 200, y: 0 });
    expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(100);
  });

  it("touchpad zoom-out respects minScale / limitToBounds (Ref #396)", () => {
    const { content, ref } = renderApp({
      minScale: 0.5,
      limitToBounds: true,
      smooth: false,
    });

    for (let i = 0; i < 50; i++) {
      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 30,
          ctrlKey: true,
          deltaMode: 0,
        }),
      );
    }

    expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
  });

  it("tall zoomed content can pan far enough upward (negative positionY) (Ref #524)", () => {
    const { pan, ref } = renderApp({
      contentHeight: "2000px",
      wrapperHeight: "500px",
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2, 0);
    pan({ x: 0, y: -600 });
    expect(ref.current!.instance.state.positionY).toBeLessThan(-1);
  });

  it("centerOnInit yields centered translation after mount (Ref #392)", async () => {
    const { ref } = renderApp({
      centerOnInit: true,
      contentHeight: "2000px",
      wrapperHeight: "500px",
      limitToBounds: false,
    });
    await waitFor(() => {
      const { positionX, positionY } = ref.current!.instance.state;
      expect(positionX !== 0 || positionY !== 0).toBe(true);
    });
  });

  it("centerView centers content within wrapper dimensions (Ref #462)", () => {
    const { ref } = renderApp({
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "300px",
      contentHeight: "300px",
      limitToBounds: false,
    });

    ref.current!.centerView(1, 0);

    const { positionX, positionY } = ref.current!.instance.state;
    expect(positionX).toBe(100);
    expect(positionY).toBe(100);
  });

  it("panning resumes after hitting bounds and reversing direction (Ref #316)", () => {
    const { pan, ref } = renderApp({
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2, 0);
    pan({ x: 1000, y: 0 });
    const posAfterRight = ref.current!.instance.state.positionX;

    pan({ x: -500, y: 0, from: { clientX: 250, clientY: 250 } });
    const posAfterLeft = ref.current!.instance.state.positionX;

    expect(posAfterLeft).toBeLessThan(posAfterRight);
  });

  it("initialPositionX is applied on first paint (Ref #483)", async () => {
    const { ref } = renderApp({
      initialPositionX: 100,
      limitToBounds: false,
    });
    await waitFor(() => {
      expect(ref.current!.instance.state.positionX).toBe(100);
    });
  });

  // The bug: explicit minPosition*/maxPosition* props were applied as fixed
  // pixel values regardless of zoom level. At scale=2 the content is twice as
  // large in pixel space, so the same fixed bounds cut the explorable content
  // area in half. The fix scales the bounds so the same content-space region
  // stays reachable at every zoom level.
  //
  // Invariant:  content-space edge visible at the viewport boundary when
  // sitting on a position bound must be identical at every scale.
  //   right content edge  = (wrapperWidth - positionX) / scale
  //   left  content edge  = -positionX / scale
  it("explicit X bounds preserve content-space boundaries across zoom (bounds-shrink-on-zoom regression)", () => {
    const { pan, ref } = renderApp({
      maxPositionX: 50,
      minPositionX: -100,
      limitToBounds: true,
      disablePadding: true,
    });

    const W = ref.current!.instance.wrapperComponent!.offsetWidth;

    // --- scale 1: hit the max bound (pan right) ---
    pan({ x: 10000, y: 0 });
    const maxS1 = ref.current!.instance.state.positionX;
    const leftEdgeS1 = -maxS1 / 1;

    // --- scale 1: hit the min bound (pan left) ---
    pan({ x: -20000, y: 0, from: { clientX: 250, clientY: 250 } });
    const minS1 = ref.current!.instance.state.positionX;
    const rightEdgeS1 = (W - minS1) / 1;

    // --- scale 2 ---
    ref.current!.setTransform(0, 0, 2, 0);

    pan({ x: 20000, y: 0 });
    const maxS2 = ref.current!.instance.state.positionX;
    const leftEdgeS2 = -maxS2 / 2;

    pan({ x: -40000, y: 0, from: { clientX: 250, clientY: 250 } });
    const minS2 = ref.current!.instance.state.positionX;
    const rightEdgeS2 = (W - minS2) / 2;

    // Pixel-space bounds must have grown with zoom
    expect(maxS2).toBeGreaterThan(maxS1);
    expect(Math.abs(minS2)).toBeGreaterThan(Math.abs(minS1));

    // Content-space boundaries must be preserved
    expect(leftEdgeS2).toBeCloseTo(leftEdgeS1, 0);
    expect(rightEdgeS2).toBeCloseTo(rightEdgeS1, 0);

    // --- scale 3: still proportional ---
    ref.current!.setTransform(0, 0, 3, 0);

    pan({ x: 30000, y: 0 });
    const leftEdgeS3 = -ref.current!.instance.state.positionX / 3;

    pan({ x: -60000, y: 0, from: { clientX: 250, clientY: 250 } });
    const rightEdgeS3 =
      (W - ref.current!.instance.state.positionX) / 3;

    expect(leftEdgeS3).toBeCloseTo(leftEdgeS1, 0);
    expect(rightEdgeS3).toBeCloseTo(rightEdgeS1, 0);
  });

  it("explicit Y bounds preserve content-space boundaries across zoom (bounds-shrink-on-zoom regression)", () => {
    const { pan, ref } = renderApp({
      maxPositionY: 40,
      minPositionY: -80,
      limitToBounds: true,
      disablePadding: true,
    });

    const H = ref.current!.instance.wrapperComponent!.offsetHeight;

    // --- scale 1 ---
    pan({ x: 0, y: 10000 });
    const maxS1 = ref.current!.instance.state.positionY;
    const topEdgeS1 = -maxS1 / 1;

    pan({ x: 0, y: -20000, from: { clientX: 250, clientY: 250 } });
    const minS1 = ref.current!.instance.state.positionY;
    const bottomEdgeS1 = (H - minS1) / 1;

    // --- scale 2 ---
    ref.current!.setTransform(0, 0, 2, 0);

    pan({ x: 0, y: 20000 });
    const topEdgeS2 = -ref.current!.instance.state.positionY / 2;

    pan({ x: 0, y: -40000, from: { clientX: 250, clientY: 250 } });
    const bottomEdgeS2 =
      (H - ref.current!.instance.state.positionY) / 2;

    expect(topEdgeS2).toBeCloseTo(topEdgeS1, 0);
    expect(bottomEdgeS2).toBeCloseTo(bottomEdgeS1, 0);
  });

  it("centerZoomedOut locks content to center after panning when zoomed out", async () => {
    const { pan, ref } = renderApp({
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "300px",
      contentHeight: "300px",
      centerOnInit: true,
      centerZoomedOut: true,
      limitToBounds: true,
      disablePadding: true,
    });

    await waitFor(() => {
      expect(ref.current!.instance.state.positionX).toBe(100);
      expect(ref.current!.instance.state.positionY).toBe(100);
    });

    pan({ x: 200, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(ref.current!.instance.state.positionY).toBe(100);

    pan({ x: -200, y: 0, from: { clientX: 250, clientY: 250 } });
    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(ref.current!.instance.state.positionY).toBe(100);

    pan({ x: 150, y: -150, from: { clientX: 250, clientY: 250 } });
    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(ref.current!.instance.state.positionY).toBe(100);
  });
});
