import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.minScale", () => {
  it("prevents zooming below minScale", () => {
    const { content, ref } = renderApp({
      minScale: 0.5,
      smooth: false,
    });
    userEvent.hover(content);
    for (let i = 0; i < 50; i++) {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: 20 }),
      );
    }
    expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
  });

  it("allows zooming down to minScale", () => {
    const { content, ref } = renderApp({
      minScale: 0.5,
      smooth: false,
    });
    userEvent.hover(content);
    for (let i = 0; i < 30; i++) {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: 10 }),
      );
    }
    expect(ref.current!.instance.state.scale).toBeLessThan(1);
    expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
  });
});

describe("ReactZoomPanPinchProps.maxScale", () => {
  it("prevents zooming above maxScale", () => {
    const { content, ref } = renderApp({
      maxScale: 3,
      smooth: false,
    });
    userEvent.hover(content);
    for (let i = 0; i < 100; i++) {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
      );
    }
    expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(3);
  });

  it("allows zooming up to maxScale", () => {
    const { content, ref } = renderApp({
      maxScale: 2,
      smooth: false,
    });
    userEvent.hover(content);
    for (let i = 0; i < 50; i++) {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
      );
    }
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(2);
  });
});
