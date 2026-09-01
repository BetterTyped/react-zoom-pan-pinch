import { act, fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

const tap = (element: Element) => {
  const touch = {
    pageX: 20,
    pageY: 20,
    clientX: 20,
    clientY: 20,
    target: element,
  };
  fireEvent.touchStart(element, { touches: [touch] });
  fireEvent.touchEnd(element, { touches: [] });
};

describe("Zoom [Double tap]", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("zooms in on two quick taps", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      doubleClick: { disabled: false, animationTime: 0 },
    });

    tap(content);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    tap(content);

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("does not zoom when the second tap arrives after the double-tap window", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      doubleClick: { disabled: false, animationTime: 0 },
    });

    tap(content);
    act(() => {
      jest.advanceTimersByTime(250);
    });
    tap(content);

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("does not zoom on double tap when doubleClick is disabled", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({ doubleClick: { disabled: true } });

    tap(content);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    tap(content);

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  // The timestamp of the first tap used to survive the double tap, so a third
  // quick tap paired with it and zoomed again.
  it("a third quick tap starts a fresh sequence instead of zooming again", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      doubleClick: { disabled: false, animationTime: 0 },
    });

    tap(content);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    tap(content);
    const zoomedOnce = ref.current!.instance.state.scale;
    expect(zoomedOnce).toBeGreaterThan(1);

    // Lets the double-click stop timer (animationTime: 0) settle.
    act(() => {
      jest.advanceTimersByTime(1);
    });
    tap(content);
    expect(ref.current!.instance.state.scale).toBe(zoomedOnce);

    act(() => {
      jest.advanceTimersByTime(50);
    });
    tap(content);
    expect(ref.current!.instance.state.scale).toBeGreaterThan(zoomedOnce);
  });
});
