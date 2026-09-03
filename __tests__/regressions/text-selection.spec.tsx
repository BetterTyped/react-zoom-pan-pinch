import React from "react";
import { createEvent, fireEvent, render } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../src";
import { renderApp } from "../utils";

/**
 * Ref #467 — the stylesheet used to put `user-select: none` on the wrapper,
 * so nothing inside the canvas could be selected or copied. Selection is now
 * blocked only while a pan gesture is active, through an inline style that is
 * restored afterwards.
 */
describe("regressions: text selection and copy (Ref #467)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("leaves text selectable at rest", () => {
    const { wrapper } = renderApp();
    expect(wrapper.style.userSelect).toBe("");
  });

  it("locks selection for the duration of a mouse pan and releases it after", () => {
    const { content, wrapper, ref } = renderApp();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(ref.current!.instance.isPanning).toBe(true);
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent.mouseMove(content, { clientX: -20, clientY: -10, buttons: 1 });
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent.mouseUp(content);
    expect(ref.current!.instance.isPanning).toBe(false);
    expect(wrapper.style.userSelect).toBe("");
    expect(content.style.transform).toBe("translate(-20px, -10px) scale(1)");
  });

  it("restores a user-provided inline user-select value", () => {
    const ref = React.createRef<ReactZoomPanPinchRef>();
    const view = render(
      <TransformWrapper ref={ref}>
        <TransformComponent wrapperStyle={{ userSelect: "text" }}>
          <div>copy me</div>
        </TransformComponent>
      </TransformWrapper>,
    );
    const wrapper = view.container.querySelector<HTMLElement>(
      ".react-transform-wrapper",
    )!;
    const content = view.container.querySelector<HTMLElement>(
      ".react-transform-component",
    )!;
    expect(wrapper.style.userSelect).toBe("text");

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent.mouseUp(content);
    expect(wrapper.style.userSelect).toBe("text");
  });

  it("prevents the native selection from starting only when a pan starts", () => {
    const { content } = renderApp({ panning: { excluded: ["no-pan"] } });
    const excluded = document.createElement("p");
    excluded.className = "no-pan";
    excluded.textContent = "selectable paragraph";
    content.appendChild(excluded);

    const panning = createEvent.mouseDown(content, {
      clientX: 0,
      clientY: 0,
      buttons: 1,
    });
    fireEvent(content, panning);
    expect(panning.defaultPrevented).toBe(true);
    fireEvent.mouseUp(content);

    const selecting = createEvent.mouseDown(excluded, {
      clientX: 0,
      clientY: 0,
      buttons: 1,
    });
    fireEvent(excluded, selecting);
    expect(selecting.defaultPrevented).toBe(false);
  });

  it("does not lock when the gesture starts on an excluded element", () => {
    const { content, wrapper, ref } = renderApp({
      panning: { excluded: ["no-pan"] },
    });
    const excluded = document.createElement("p");
    excluded.className = "no-pan";
    content.appendChild(excluded);

    fireEvent.mouseDown(excluded, { clientX: 0, clientY: 0, buttons: 1 });
    expect(ref.current!.instance.isPanning).toBe(false);
    expect(wrapper.style.userSelect).toBe("");
    fireEvent.mouseUp(excluded);
  });

  it("does not lock when panning is disabled", () => {
    const { content, wrapper } = renderApp({ panning: { disabled: true } });

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(wrapper.style.userSelect).toBe("");
    fireEvent.mouseUp(content);
  });

  it("does not lock for a mouse button that may not pan", () => {
    const { content, wrapper } = renderApp({
      panning: { allowLeftClickPan: false },
    });

    fireEvent.mouseDown(content, {
      clientX: 0,
      clientY: 0,
      button: 0,
      buttons: 1,
    });
    expect(wrapper.style.userSelect).toBe("");
  });

  it("locks during a touch pan and releases on touchend", () => {
    const { content, wrapper } = renderApp();
    const touch = (clientX: number, clientY: number) => [
      { clientX, clientY, pageX: clientX, pageY: clientY, target: content },
    ];

    fireEvent.touchStart(content, { touches: touch(0, 0) });
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent.touchMove(content, { touches: touch(-15, -5) });
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent.touchEnd(content, { touches: touch(-15, -5) });
    expect(wrapper.style.userSelect).toBe("");
  });

  it("releases the lock when the window loses focus mid-pan", () => {
    const { content, wrapper, ref } = renderApp();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(wrapper.style.userSelect).toBe("none");

    fireEvent(window, new Event("blur"));

    expect(ref.current!.instance.isPanning).toBe(false);
    expect(wrapper.style.userSelect).toBe("");
  });

  it("releases the lock when a missed mouseup is detected", () => {
    const { content, wrapper } = renderApp();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    // A move with no buttons pressed means the mouseup was swallowed.
    fireEvent.mouseMove(content, { clientX: 10, clientY: 10, buttons: 0 });

    expect(wrapper.style.userSelect).toBe("");
  });

  it("releases the lock on unmount mid-pan", () => {
    const view = renderApp();

    fireEvent.mouseDown(view.content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(view.wrapper.style.userSelect).toBe("none");

    expect(() => view.unmount()).not.toThrow();
    expect(view.wrapper.style.userSelect).toBe("");
  });

  it("locking twice keeps the original value to restore", () => {
    const { content, wrapper, ref } = renderApp();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    // A second start while already locked must not capture "none" as the
    // value to restore.
    ref.current!.instance.lockTextSelection();
    fireEvent.mouseUp(content);

    expect(wrapper.style.userSelect).toBe("");
  });
});
