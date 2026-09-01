import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReactZoomPanPinchRef } from "../../src";
import { renderApp } from "../utils";

const NativeResizeObserver = global.ResizeObserver;

beforeAll(() => {
  /* eslint-disable class-methods-use-this */
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  /* eslint-enable class-methods-use-this */
});

afterAll(() => {
  global.ResizeObserver = NativeResizeObserver;
});

describe("bounds and centering regressions", () => {
  describe("Ref #250", () => {
    // Explicit bounds are content-space values at scale 1 and scale with the
    // zoom: maxPositionX 50 => 100 at scale 2, minPositionX -100 =>
    // wrapperWidth * (1 - 2) + (-100 * 2) = -700 at scale 2.
    it("maxPositionX clamps a rightward pan exactly at the scaled bound (Ref #250)", () => {
      const { pan, ref } = renderApp({
        maxPositionX: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);

      pan({ x: 200, y: 0 });

      expect(ref.current!.instance.state.positionX).toBe(100);
    });

    it("minPositionX clamps a leftward pan exactly at the scaled bound (Ref #250, dupe #478)", () => {
      const { pan, ref } = renderApp({
        minPositionX: -100,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);

      pan({ x: -20000, y: 0 });

      expect(ref.current!.instance.state.positionX).toBe(-700);
    });
  });

  describe("Ref #396", () => {
    it("trackpad panning never leaves the bounds, at any point of the gesture (Ref #396, dupe #433)", () => {
      const seenX: number[] = [];
      const { trackPadPan, ref } = renderApp({
        wheel: { disabled: true },
        trackPadPanning: { disabled: false },
        limitToBounds: true,
        disablePadding: true,
        onPanning: (ctx: ReactZoomPanPinchRef) => {
          seenX.push(ctx.state.positionX);
        },
      });
      // wrapper 500, content 100 % => 1000 px at scale 2 => bounds [-500, 0]
      ref.current!.setTransform(0, 0, 2, 0);

      trackPadPan({ x: 2000, y: 0, moveEventCount: 5 });
      expect(ref.current!.instance.state.positionX).toBe(0);

      trackPadPan({ x: -3000, y: 0, moveEventCount: 5 });
      expect(ref.current!.instance.state.positionX).toBe(-500);

      expect(seenX.length).toBeGreaterThan(0);
      expect(Math.max(...seenX)).toBeLessThanOrEqual(0);
      expect(Math.min(...seenX)).toBeGreaterThanOrEqual(-500);
    });
  });

  describe("Ref #524", () => {
    it("both content edges stay reachable after zooming on a focal point near the bottom (Ref #524)", () => {
      const { content, pan, ref } = renderApp({
        contentHeight: "2000px",
        wrapperHeight: "500px",
        limitToBounds: true,
        disablePadding: true,
        smooth: false,
        wheel: { step: 1 },
      });

      // One wheel notch at the bottom of the viewport: scale 2 anchored there.
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: -1,
          clientX: 250,
          clientY: 450,
        }),
      );
      expect(ref.current!.instance.state.scale).toBe(2);
      expect(ref.current!.instance.state.positionY).toBe(-450);

      // Content above the focal point: pan down until the top edge shows.
      pan({ x: 0, y: 1000, from: { clientX: 250, clientY: 100 } });
      expect(ref.current!.instance.state.positionY).toBe(0);

      // And the bottom edge: 500 - 2000 * 2 = -3500.
      pan({ x: 0, y: -5000, from: { clientX: 250, clientY: 400 } });
      expect(ref.current!.instance.state.positionY).toBe(-3500);
    });
  });

  describe("Ref #392", () => {
    it("centerOnInit centers synchronously on mount (Ref #392)", () => {
      const { ref, content } = renderApp({
        centerOnInit: true,
        contentHeight: "2000px",
        wrapperHeight: "500px",
        limitToBounds: false,
      });

      // wrapper 500 x 500, content 500 x 2000 => (0, -750), no waitFor.
      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(-750);
      expect(content.style.transform).toBe("translate(0px, -750px) scale(1)");
    });
  });

  describe("Ref #462", () => {
    it("centerView ignores the wrapper's page offset and centers within the wrapper (Ref #462)", () => {
      const { ref, wrapper } = renderApp({
        wrapperWidth: "500px",
        wrapperHeight: "500px",
        contentWidth: "300px",
        contentHeight: "300px",
        limitToBounds: false,
      });

      // The wrapper sits somewhere in the page; that must not leak into the
      // transform, which is relative to the wrapper.
      jest.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
        width: 500,
        height: 500,
        top: 60,
        left: 120,
        bottom: 560,
        right: 620,
        x: 120,
        y: 60,
        toJSON: () => ({}),
      } as DOMRect);

      ref.current!.centerView(1, 0);

      const { positionX, positionY } = ref.current!.instance.state;
      expect(positionX).toBe(100);
      expect(positionY).toBe(100);
      // Rendered centre of the content == visual centre of the wrapper.
      expect(120 + positionX + 150).toBe(120 + 250);
      expect(60 + positionY + 150).toBe(60 + 250);
    });
  });

  it("panning resumes after hitting bounds and reversing direction (Ref #316)", () => {
    const { pan, ref } = renderApp({
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2, 0);
    pan({ x: 1000, y: 0 });
    const posAfterRight = ref.current!.instance.state.positionX;
    expect(posAfterRight).toBe(0);

    pan({ x: -500, y: 0, from: { clientX: 250, clientY: 250 } });
    const posAfterLeft = ref.current!.instance.state.positionX;

    expect(posAfterLeft).toBe(-500);
  });

  it("initialPositionX is applied in the very first render (Ref #483)", () => {
    const { ref, content } = renderApp({
      initialPositionX: 100,
      limitToBounds: false,
    });

    // Synchronous on purpose: a waitFor would hide a wrong first paint that
    // corrects itself later.
    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(content.style.transform).toBe("translate(100px, 0px) scale(1)");
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
    const rightEdgeS3 = (W - ref.current!.instance.state.positionX) / 3;

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
    const bottomEdgeS2 = (H - ref.current!.instance.state.positionY) / 2;

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
