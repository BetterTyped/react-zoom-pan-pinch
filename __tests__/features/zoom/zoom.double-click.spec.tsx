import { act, fireEvent } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("Zoom [Double click]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("double-click zooms in by step amount", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      doubleClick: { disabled: false, step: 0.5, animationTime: 80 },
      smooth: false,
    });

    act(() => {
      fireEvent.doubleClick(content);
    });
    act(() => {
      flushAnimationFrames(40);
    });

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("double-click does not zoom when disabled", () => {
    const { content, ref } = renderApp({
      doubleClick: { disabled: true },
    });

    fireEvent.doubleClick(content);
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("double-click reset mode returns to scale 1 after zoom", () => {
    jest.useFakeTimers();
    const { content, ref, zoom } = renderApp({
      doubleClick: { disabled: false, mode: "reset", animationTime: 50 },
      smooth: false,
    });

    zoom({ value: 2 });
    expect(ref.current!.instance.state.scale).toBeCloseTo(2, 0);

    act(() => {
      fireEvent.doubleClick(content);
    });
    act(() => {
      flushAnimationFrames(40);
    });

    expect(ref.current!.instance.state.scale).toBeCloseTo(1, 0);
  });

  it("double-click on excluded element is ignored", () => {
    const { wrapper, ref } = renderApp({
      doubleClick: { disabled: false, excluded: ["panningDisabled"] },
    });

    const excluded = wrapper.querySelector(".panningDisabled");
    fireEvent.doubleClick(excluded!);
    expect(ref.current!.instance.state.scale).toBe(1);
  });
});
