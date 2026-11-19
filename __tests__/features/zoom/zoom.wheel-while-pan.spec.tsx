import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

/**
 * Wheel zoom while a mouse pan is held (#543,
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/543). Until
 * 4.2 the wheel was ignored mid-drag; it now zooms and the drag continues
 * from the zoomed state.
 */
describe("Zoom [Wheel while panning]", () => {
  // 500×500 wrapper and content; smooth wheel: step 0.015 × |deltaY| 100 →
  // +1.5, so one notch takes scale 1 → 2.5 around the pointer at (200, 200):
  // position = 0 − 200 × (2.5 − 1) = −300 on both axes.
  const wheelAt = (content: HTMLElement, clientX: number, clientY: number) =>
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -100,
        clientX,
        clientY,
      }),
    );

  it("zooms around the pointer during an active mouse pan (#543)", () => {
    const { content, ref } = renderApp();

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 200, clientY: 200, buttons: 1 });
    wheelAt(content, 200, 200);

    expect(ref.current!.instance.state.scale).toBe(2.5);
    expect(content.style.transform).toBe(
      "translate(-300px, -300px) scale(2.5)",
    );
    fireEvent.mouseUp(content);
  });

  it("continues the drag from the zoomed state instead of snapping back (#543)", () => {
    const { content } = renderApp();

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 200, clientY: 200, buttons: 1 });
    wheelAt(content, 200, 200);
    // Re-anchored at (200, 200) ↔ (−300, −300): moving the pointer by
    // (−50, 0) moves the content by the same. Without the re-anchor the old
    // anchor (taken at scale 1) maps this move to (−50, 0) — a 250px jump.
    fireEvent.mouseMove(content, { clientX: 150, clientY: 200, buttons: 1 });

    expect(content.style.transform).toBe(
      "translate(-350px, -300px) scale(2.5)",
    );
    fireEvent.mouseUp(content);
  });

  it("keeps the scale inside maxScale mid-drag, even for a trackpad pinch (#543)", () => {
    // ctrl+wheel (trackpad pinch) may overshoot maxScale by `zoomAnimation.size`
    // and animate back on stop; mid-drag that animation would fight the
    // pointer, so the scale is clamped instead.
    const { content, ref } = renderApp({ maxScale: 2 });

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 200, clientY: 200, buttons: 1 });
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -100,
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    expect(ref.current!.instance.state.scale).toBe(2);
    fireEvent.mouseUp(content);
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
