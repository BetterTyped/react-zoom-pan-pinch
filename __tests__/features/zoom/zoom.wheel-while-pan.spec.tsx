import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("Zoom [Wheel while panning]", () => {
  it("wheel zoom is suppressed during an active mouse-pan gesture", () => {
    const { content, ref } = renderApp({
      smooth: false,
    });

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 50, clientY: 50, buttons: 1 });

    fireEvent(content, new WheelEvent("wheel", { bubbles: true, deltaY: -10 }));

    fireEvent.mouseUp(content);

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("wheel zoom disabled does not change scale mid-pan", () => {
    const { content, ref } = renderApp({
      wheel: { disabled: true },
    });

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 50, clientY: 50, buttons: 1 });

    fireEvent(content, new WheelEvent("wheel", { bubbles: true, deltaY: -10 }));

    fireEvent.mouseUp(content);

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("ctrl+wheel zoom works alongside panning", () => {
    const { content, ref } = renderApp({
      smooth: false,
    });

    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -10,
        ctrlKey: true,
      }),
    );

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });
});

describe("Zoom [Keyboard]", () => {
  it("wheel with activationKeys requires key held", () => {
    const { content, ref } = renderApp({
      wheel: { activationKeys: ["Control"] },
    });

    userEvent.hover(content);
    fireEvent(content, new WheelEvent("wheel", { bubbles: true, deltaY: -5 }));
    expect(ref.current!.instance.state.scale).toBe(1);

    fireEvent(
      content,
      new WheelEvent("wheel", { bubbles: true, deltaY: -5, ctrlKey: true }),
    );
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });
});
