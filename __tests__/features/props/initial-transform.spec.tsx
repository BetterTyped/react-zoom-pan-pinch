import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.initialScale", () => {
  it("applies the specified initial scale on mount", async () => {
    const { ref } = renderApp({ initialScale: 2 });
    await waitFor(() => {
      expect(ref.current!.instance.state.scale).toBe(2);
    });
  });

  it("defaults to scale 1 when not specified", () => {
    const { ref } = renderApp();
    expect(ref.current!.instance.state.scale).toBe(1);
  });
});

describe("ReactZoomPanPinchProps.initialPositionX", () => {
  it("applies initial horizontal position", async () => {
    const { ref } = renderApp({
      initialPositionX: 50,
      limitToBounds: false,
    });
    await waitFor(() => {
      expect(ref.current!.instance.state.positionX).toBe(50);
    });
  });
});

describe("ReactZoomPanPinchProps.initialPositionY", () => {
  it("applies initial vertical position", async () => {
    const { ref } = renderApp({
      initialPositionY: 75,
      limitToBounds: false,
    });
    await waitFor(() => {
      expect(ref.current!.instance.state.positionY).toBe(75);
    });
  });
});
