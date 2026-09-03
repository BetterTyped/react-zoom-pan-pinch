import React from "react";
import { act, createEvent, fireEvent, render } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../../src";
import { renderApp, flushAnimationFrames } from "../../utils";

const size = {
  wrapperWidth: "500px",
  wrapperHeight: "500px",
  contentWidth: "1000px",
  contentHeight: "1000px",
};

const enabled = { disabled: false, animationTime: 0 };

const key = (target: Element, k: string, init: KeyboardEventInit = {}) => {
  const event = createEvent.keyDown(target, { key: k, ...init });
  fireEvent(target, event);
  return event;
};

/**
 * Keyboard navigation (#254): opt-in; while the wrapper (or something inside
 * it) is focused, arrows pan, +/- zoom and 0 resets.
 */
describe("keyboard navigation (#254)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("is off by default: keys do nothing and the wrapper is not focusable", () => {
    const { ref, wrapper } = renderApp(size);
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    const event = key(wrapper, "ArrowLeft");

    expect(ref.current!.instance.state.positionX).toBe(-250);
    expect(event.defaultPrevented).toBe(false);
    expect(wrapper.hasAttribute("tabindex")).toBe(false);
  });

  it("makes the wrapper focusable when enabled, unless wrapperProps says otherwise", () => {
    const { wrapper } = renderApp({ ...size, keyboard: enabled });
    expect(wrapper.getAttribute("tabindex")).toBe("0");

    const view = render(
      <TransformWrapper keyboard={{ disabled: false }}>
        <TransformComponent wrapperProps={{ tabIndex: -1 }}>
          <div />
        </TransformComponent>
      </TransformWrapper>,
    );
    expect(
      view.container
        .querySelector(".react-transform-wrapper")!
        .getAttribute("tabindex"),
    ).toBe("-1");
  });

  it("arrow keys move the viewport by panStep", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    // Left reveals content on the left: the content shifts right.
    key(wrapper, "ArrowLeft");
    expect(ref.current!.instance.state).toMatchObject({
      positionX: -200,
      positionY: -250,
    });
    key(wrapper, "ArrowRight");
    expect(ref.current!.instance.state.positionX).toBe(-250);
    key(wrapper, "ArrowUp");
    expect(ref.current!.instance.state.positionY).toBe(-200);
    key(wrapper, "ArrowDown");
    expect(ref.current!.instance.state.positionY).toBe(-250);
  });

  it("respects the pan bounds", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });

    key(wrapper, "ArrowLeft");
    key(wrapper, "ArrowUp");

    expect(ref.current!.instance.state).toMatchObject({
      positionX: 0,
      positionY: 0,
    });
  });

  it("+ / = zoom in and - / _ zoom out by zoomStep", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });

    key(wrapper, "+");
    expect(ref.current!.instance.state.scale).toBe(1.25);
    key(wrapper, "=");
    expect(ref.current!.instance.state.scale).toBe(1.5);
    key(wrapper, "-");
    expect(ref.current!.instance.state.scale).toBe(1.25);
    key(wrapper, "_");
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("0 resets the transform", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });

    key(wrapper, "+");
    key(wrapper, "ArrowRight");
    expect(ref.current!.instance.state.scale).toBe(1.25);
    expect(ref.current!.instance.state.positionX).toBeLessThan(0);

    key(wrapper, "0");

    expect(ref.current!.instance.state).toMatchObject({
      scale: 1,
      positionX: 0,
      positionY: 0,
    });
  });

  it("prevents the default action only for handled keys", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    expect(key(wrapper, "ArrowLeft").defaultPrevented).toBe(true);
    expect(key(wrapper, "a").defaultPrevented).toBe(false);
    expect(key(wrapper, "Tab").defaultPrevented).toBe(false);
    expect(key(wrapper, "Enter").defaultPrevented).toBe(false);
  });

  it("leaves modifier combos (browser shortcuts) alone", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });

    expect(key(wrapper, "-", { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(key(wrapper, "0", { metaKey: true }).defaultPrevented).toBe(false);
    expect(key(wrapper, "ArrowLeft", { altKey: true }).defaultPrevented).toBe(
      false,
    );
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("ignores keys typed into editable elements inside the content", () => {
    const { ref, wrapper, content } = renderApp({ ...size, keyboard: enabled });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });
    const input = document.createElement("input");
    content.appendChild(input);
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    content.appendChild(editable);

    expect(key(input, "ArrowLeft").defaultPrevented).toBe(false);
    expect(key(editable, "ArrowLeft").defaultPrevented).toBe(false);
    expect(ref.current!.instance.state.positionX).toBe(-250);

    expect(key(wrapper, "ArrowLeft").defaultPrevented).toBe(true);
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("ignores keyboard.excluded targets", () => {
    const { ref, content } = renderApp({
      ...size,
      keyboard: { ...enabled, excluded: ["no-keys"] },
    });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });
    const excluded = document.createElement("div");
    excluded.className = "no-keys";
    excluded.tabIndex = 0;
    content.appendChild(excluded);
    const ordinary = document.createElement("div");
    ordinary.tabIndex = 0;
    content.appendChild(ordinary);

    expect(key(excluded, "ArrowLeft").defaultPrevented).toBe(false);
    expect(ref.current!.instance.state.positionX).toBe(-250);

    expect(key(ordinary, "ArrowLeft").defaultPrevented).toBe(true);
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("respects panning.lockAxisX / lockAxisY", () => {
    const { ref, wrapper } = renderApp({
      ...size,
      keyboard: enabled,
      panning: { lockAxisX: true },
    });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    key(wrapper, "ArrowLeft");
    key(wrapper, "ArrowUp");

    expect(ref.current!.instance.state).toMatchObject({
      positionX: -250,
      positionY: -200,
    });
  });

  it("panStep and zoomStep are configurable", () => {
    const { ref, wrapper } = renderApp({
      ...size,
      keyboard: { ...enabled, panStep: 10, zoomStep: 0.5 },
    });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    key(wrapper, "ArrowLeft");
    expect(ref.current!.instance.state.positionX).toBe(-240);
    key(wrapper, "+");
    expect(ref.current!.instance.state.scale).toBe(1.5);
  });

  it("animates a step with keyboard.animationTime", async () => {
    jest.useFakeTimers();
    const { ref, wrapper } = renderApp({
      ...size,
      keyboard: { disabled: false, animationTime: 100 },
    });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });

    key(wrapper, "ArrowLeft");
    act(() => {
      jest.advanceTimersByTime(16);
    });
    const midway = ref.current!.instance.state.positionX;
    expect(midway).toBeGreaterThan(-250);
    expect(midway).toBeLessThan(-200);

    act(() => {
      flushAnimationFrames(20);
    });
    expect(ref.current!.instance.state.positionX).toBeCloseTo(-200, 5);
  });

  it("does nothing when the whole wrapper is disabled", () => {
    const { ref, wrapper } = renderApp({
      ...size,
      keyboard: enabled,
      disabled: true,
    });

    expect(key(wrapper, "+").defaultPrevented).toBe(false);
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("does nothing after unmount", () => {
    const view = renderApp({ ...size, keyboard: enabled });
    const { ref, wrapper } = view;
    const { instance } = ref.current!;
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });
    view.unmount();

    expect(() => key(wrapper, "ArrowLeft")).not.toThrow();
    expect(instance.state.positionX).toBe(-250);
  });

  it("focuses the wrapper when a pan starts, so the keys reach it (Storybook, hosts)", () => {
    const { ref, wrapper, content } = renderApp({ ...size, keyboard: enabled });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });
    expect(document.activeElement).not.toBe(wrapper);

    // The pan handler cancels the mousedown, which would normally also cancel
    // the focus a click gives a tabIndex element.
    fireEvent.mouseDown(content, { clientX: 10, clientY: 10, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(document.activeElement).toBe(wrapper);
    key(document.activeElement!, "ArrowLeft");
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("does not steal focus when keyboard navigation is off", () => {
    const { wrapper, content } = renderApp(size);

    fireEvent.mouseDown(content, { clientX: 10, clientY: 10, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(document.activeElement).not.toBe(wrapper);
  });

  it("leaves focus on an editable element inside the content", () => {
    const { wrapper, content } = renderApp({ ...size, keyboard: enabled });
    const input = document.createElement("input");
    content.appendChild(input);
    input.focus();

    fireEvent.mouseDown(input, { clientX: 10, clientY: 10, buttons: 1 });
    fireEvent.mouseUp(input);

    expect(document.activeElement).toBe(input);
    expect(document.activeElement).not.toBe(wrapper);
  });

  it("stops handled keys from reaching host listeners, lets others through", () => {
    const { ref, wrapper } = renderApp({ ...size, keyboard: enabled });
    act(() => {
      ref.current!.setTransform(-250, -250, 1, 0);
    });
    const host = jest.fn();
    window.addEventListener("keydown", host);

    key(wrapper, "ArrowLeft");
    expect(host).not.toHaveBeenCalled();

    key(wrapper, "a");
    expect(host).toHaveBeenCalledTimes(1);
    window.removeEventListener("keydown", host);
  });

  it("works through the ref-less component tree (focused child)", () => {
    const ref = React.createRef<ReactZoomPanPinchRef>();
    const view = render(
      <TransformWrapper
        ref={ref}
        keyboard={{ disabled: false, animationTime: 0 }}
        limitToBounds={false}
      >
        <TransformComponent>
          <button type="button">inside</button>
        </TransformComponent>
      </TransformWrapper>,
    );
    const button = view.getByText("inside");

    key(button, "ArrowDown");

    expect(ref.current!.instance.state.positionY).toBe(-50);
  });
});
