import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

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

describe("ReactZoomPanPinchProps.minPositionX", () => {
  it("clamps pan so positionX does not go below minPositionX", () => {
    const { pan, ref } = renderApp({
      minPositionX: -50,
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2);
    pan({ x: -500, y: 0 });
    expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(-50);
  });
});

describe("ReactZoomPanPinchProps.maxPositionX", () => {
  it("clamps pan so positionX does not exceed maxPositionX", () => {
    const { pan, ref } = renderApp({
      maxPositionX: 50,
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2);
    pan({ x: 500, y: 0 });
    expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(50);
  });
});

describe("ReactZoomPanPinchProps.minPositionY", () => {
  it("clamps pan so positionY does not go below minPositionY", () => {
    const { pan, ref } = renderApp({
      minPositionY: -50,
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2);
    pan({ x: 0, y: -500 });
    expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(-50);
  });
});

describe("ReactZoomPanPinchProps.maxPositionY", () => {
  it("clamps pan so positionY does not exceed maxPositionY", () => {
    const { pan, ref } = renderApp({
      maxPositionY: 50,
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2);
    pan({ x: 0, y: 500 });
    expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(50);
  });
});

describe("ReactZoomPanPinchProps.limitToBounds", () => {
  it("prevents content from being panned outside wrapper when true", () => {
    const { pan, ref } = renderApp({
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(0, 0, 2);
    pan({ x: 2000, y: 2000 });
    const { positionX, positionY } = ref.current!.instance.state;
    expect(positionX).toBeLessThan(2000);
    expect(positionY).toBeLessThan(2000);
  });

  it("allows panning freely when limitToBounds is false", () => {
    const { pan, content } = renderApp({
      limitToBounds: false,
    });
    pan({ x: -200, y: -200 });
    expect(content.style.transform).toBe(
      "translate(-200px, -200px) scale(1)",
    );
  });
});

describe("ReactZoomPanPinchProps.centerZoomedOut", () => {
  it("defaults to true — content stays centered when zoomed below 1", () => {
    const { ref } = renderApp({
      centerZoomedOut: true,
      minScale: 0.5,
    });
    ref.current!.setTransform(0, 0, 0.5);
    const { positionX, positionY } = ref.current!.instance.state;
    expect(positionX).toBeGreaterThanOrEqual(0);
    expect(positionY).toBeGreaterThanOrEqual(0);
  });
});

describe("ReactZoomPanPinchProps.centerOnInit", () => {
  it("centers content in the viewport on mount", async () => {
    const { ref } = renderApp({
      centerOnInit: true,
      limitToBounds: false,
      contentHeight: "2000px",
      wrapperHeight: "500px",
    });
    await waitFor(() => {
      const { positionX, positionY } = ref.current!.instance.state;
      expect(positionX !== 0 || positionY !== 0).toBe(true);
    });
  });
});

describe("ReactZoomPanPinchProps.disablePadding", () => {
  it("prevents overscroll past bounds when true", () => {
    const { pan, content } = renderApp({
      disablePadding: true,
    });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    pan({ x: -100, y: -100 });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("allows overscroll (padding) when false", () => {
    const { pan, content } = renderApp({
      disablePadding: false,
    });
    pan({ x: -100, y: -100 });
    expect(content.style.transform).toBe(
      "translate(-100px, -100px) scale(1)",
    );
  });
});
