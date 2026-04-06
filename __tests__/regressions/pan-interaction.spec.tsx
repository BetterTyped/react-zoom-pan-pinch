import { fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../utils";

describe("pan interaction regressions", () => {
  it("routes large horizontal wheel delta to trackpad pan, not zoom (Ref #168)", () => {
    const { content } = renderApp({
      wheel: { disabled: true },
      trackPadPanning: { disabled: false },
    });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaX: -50,
        deltaY: 0,
      }),
    );
    expect(content.style.transform).toBe("translate(50px, 0px) scale(1)");
  });

  it("treats deltaMode 0 wheel as trackpad for panning (Ref #404)", () => {
    const { content } = renderApp({
      wheel: { disabled: true },
      trackPadPanning: { disabled: false },
    });
    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaMode: 0,
        deltaX: -30,
        deltaY: -30,
      }),
    );
    expect(content.style.transform).toBe("translate(30px, 30px) scale(1)");
  });

  it("settles deterministically after rapid double-click zoom (Ref #408)", () => {
    jest.useFakeTimers();
    const run = () => {
      const { content, wrapper, unmount } = renderApp({
        doubleClick: { disabled: false },
      });
      fireEvent.doubleClick(wrapper, { clientX: 250, clientY: 250 });
      fireEvent.doubleClick(wrapper, { clientX: 250, clientY: 250 });
      act(() => {
        flushAnimationFrames();
      });
      const transform = content.style.transform;
      unmount();
      return transform;
    };
    try {
      expect(run()).toBe(run());
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not start pan from excluded region (Ref #437)", () => {
    const { content, wrapper } = renderApp({
      panning: { excluded: ["panningDisabled"] },
    });
    const region = wrapper.querySelector(".panningDisabled");
    expect(region).toBeTruthy();
    fireEvent.mouseDown(region!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(region!, { clientX: 60, clientY: 60 });
    fireEvent.mouseUp(region!);
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("does not start pan when mousedown is on a draggable element (Ref #460)", () => {
    const { content } = renderApp({});
    const drag = document.createElement("div");
    drag.setAttribute("draggable", "true");
    drag.textContent = "drag me";
    content.appendChild(drag);

    fireEvent.mouseDown(drag, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 60 });
    fireEvent.mouseUp(document);

    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("does not call preventDefault on non-cancelable touchmove (Ref #538)", () => {
    const { content } = renderApp({});

    fireEvent.touchStart(content, {
      touches: [
        {
          identifier: 0,
          clientX: 20,
          clientY: 20,
          pageX: 20,
          pageY: 20,
          target: content,
        },
      ],
    });

    const move = new Event("touchmove", {
      bubbles: true,
      cancelable: false,
    });
    Object.defineProperty(move, "touches", {
      value: [
        {
          identifier: 0,
          clientX: 60,
          clientY: 60,
          pageX: 60,
          pageY: 60,
          target: content,
        },
      ],
    });
    const spy = jest.spyOn(move, "preventDefault");
    content.dispatchEvent(move);

    expect(spy).not.toHaveBeenCalled();
  });

  it("does not call preventDefault on touchmove for vertical scroll gesture (Ref #434)", () => {
    const { content } = renderApp({});

    fireEvent.touchStart(content, {
      touches: [
        {
          identifier: 0,
          clientX: 200,
          clientY: 300,
          pageX: 200,
          pageY: 300,
          target: content,
        },
      ],
    });

    const move = new Event("touchmove", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(move, "touches", {
      value: [
        {
          identifier: 0,
          clientX: 200,
          clientY: 200,
          pageX: 200,
          pageY: 200,
          target: content,
        },
      ],
    });
    const spy = jest.spyOn(move, "preventDefault");
    content.dispatchEvent(move);

    expect(spy).not.toHaveBeenCalled();
  });

  it("does not call preventDefault on mousedown over contenteditable (Ref #437)", () => {
    const { content } = renderApp({});
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    editable.textContent = "editable text";
    content.appendChild(editable);

    const down = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY: 10,
    });
    const spy = jest.spyOn(down, "preventDefault");
    editable.dispatchEvent(down);

    expect(spy).not.toHaveBeenCalled();
  });

  it("wrapper CSS does not set user-select: none that blocks text copy (Ref #467)", () => {
    const cssPath = require("path").resolve(
      __dirname,
      "../../src/components/transform-component/transform-component.module.css",
    );
    const css = require("fs").readFileSync(cssPath, "utf-8") as string;
    expect(css).not.toMatch(/user-select:\s*none/);
  });

  it("re-measures position after content dimensions change (Ref #439)", async () => {
    const { ref, content } = renderApp({
      centerOnInit: true,
      limitToBounds: false,
    });

    const initialX = ref.current!.instance.state.positionX;

    Object.defineProperty(content, "offsetWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(content, "offsetHeight", {
      configurable: true,
      value: 800,
    });

    const img = document.createElement("img");
    content.appendChild(img);
    fireEvent.load(img);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(ref.current!.instance.state.positionX).not.toBe(initialX);
  });
});
