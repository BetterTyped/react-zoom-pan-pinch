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
    ref.current!.setTransform(0, 0, 2, 0);
    pan({ x: 200, y: 0 });
    expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(50);
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
});
