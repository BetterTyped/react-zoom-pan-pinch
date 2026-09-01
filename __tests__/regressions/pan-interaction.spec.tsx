import { fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../utils";

const INITIAL = "translate(0px, 0px) scale(1)";

const touch = (element: Element, x: number, y: number) => ({
  identifier: 0,
  clientX: x,
  clientY: y,
  pageX: x,
  pageY: y,
  target: element,
});

const touchMoveEvent = (
  element: Element,
  x: number,
  y: number,
  cancelable: boolean,
) => {
  const move = new Event("touchmove", { bubbles: true, cancelable });
  Object.defineProperty(move, "touches", { value: [touch(element, x, y)] });
  return move;
};

const dragMouse = (
  element: Element,
  from: [number, number],
  to: [number, number],
) => {
  fireEvent.mouseDown(element, {
    clientX: from[0],
    clientY: from[1],
    buttons: 1,
  });
  fireEvent.mouseMove(element, { clientX: to[0], clientY: to[1], buttons: 1 });
  fireEvent.mouseUp(element);
};

describe("pan interaction regressions", () => {
  describe("Ref #168", () => {
    it("a purely horizontal wheel swipe pans instead of zooming when trackpad panning is on (Ref #168)", () => {
      const { content, ref } = renderApp({
        trackPadPanning: { disabled: false },
      });
      expect(content.style.transform).toBe(INITIAL);

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaX: -50, deltaY: 0 }),
      );

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(content.style.transform).toBe("translate(50px, 0px) scale(1)");
    });

    it("a purely horizontal wheel swipe does not zoom out with the default props (Ref #168)", () => {
      const { content, ref } = renderApp({ initialScale: 2 });

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaX: -50, deltaY: 0 }),
      );

      expect(ref.current!.instance.state.scale).toBe(2);
    });

    it("a vertical wheel still zooms with the default props (control)", () => {
      const { content, ref } = renderApp();

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaX: 0, deltaY: -1 }),
      );

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.015, 10);
    });
  });

  // The library does not implement a deltaMode / wheelDeltaY device
  // heuristic (Ref #404): trackpad panning is opted into via props and then
  // consumes every wheel event that zoom does not claim.
  it("pixel-mode wheel deltas pan on both axes when wheel zoom is disabled (Ref #404)", () => {
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

  describe("Ref #408", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("a double-click during the previous zoom animation is ignored, and one after it is applied exactly (Ref #408)", () => {
      jest.useFakeTimers();
      const { wrapper, ref } = renderApp({
        doubleClick: { disabled: false, step: 0.7, animationTime: 100 },
      });

      fireEvent.doubleClick(wrapper, { clientX: 250, clientY: 250 });
      // Rapid second click while the first one is still animating.
      fireEvent.doubleClick(wrapper, { clientX: 250, clientY: 250 });
      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.7, 10);
      // Anchored on the cursor: 0 - 250 * (1.7 - 1)
      expect(ref.current!.instance.state.positionX).toBeCloseTo(-175, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(-175, 5);

      act(() => {
        jest.advanceTimersByTime(150);
      });
      fireEvent.doubleClick(wrapper, { clientX: 250, clientY: 250 });
      act(() => {
        flushAnimationFrames();
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(2.4, 10);
      // -175 - (250 / 1.7) * 0.7, rounded to two decimals by the bounds clamp
      expect(ref.current!.instance.state.positionX).toBeCloseTo(-277.94, 1);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(-277.94, 1);
    });
  });

  describe("Ref #437 / #460", () => {
    it("does not start a pan from a panning.excluded region, but does from its sibling (Ref #437)", () => {
      const { content, wrapper } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });
      const region = wrapper.querySelector(".panningDisabled") as HTMLElement;
      const sibling = wrapper.querySelector(".wheelDisabled") as HTMLElement;

      dragMouse(region, [10, 10], [60, 60]);
      expect(content.style.transform).toBe(INITIAL);

      dragMouse(sibling, [10, 10], [60, 60]);
      expect(content.style.transform).toBe("translate(50px, 50px) scale(1)");
    });

    it("does not start a pan from a draggable element or its children (Ref #460)", () => {
      const { content } = renderApp({});
      const drag = document.createElement("div");
      drag.setAttribute("draggable", "true");
      const label = document.createElement("span");
      label.textContent = "drag me";
      drag.appendChild(label);
      content.appendChild(drag);

      dragMouse(drag, [10, 10], [60, 60]);
      expect(content.style.transform).toBe(INITIAL);

      dragMouse(label, [10, 10], [60, 60]);
      expect(content.style.transform).toBe(INITIAL);

      dragMouse(content, [10, 10], [60, 60]);
      expect(content.style.transform).toBe("translate(50px, 50px) scale(1)");
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
  });

  describe("Ref #538 / #434", () => {
    it("does not call preventDefault on a non-cancelable touchmove (Ref #538)", () => {
      const { content } = renderApp({});

      fireEvent.touchStart(content, { touches: [touch(content, 20, 20)] });
      const move = touchMoveEvent(content, 60, 60, false);
      const spy = jest.spyOn(move, "preventDefault");
      content.dispatchEvent(move);

      expect(spy).not.toHaveBeenCalled();
    });

    it("calls preventDefault on a cancelable touchmove while panning (control for #538)", () => {
      const { content } = renderApp({});

      fireEvent.touchStart(content, { touches: [touch(content, 200, 300)] });
      const move = touchMoveEvent(content, 200, 200, true);
      const spy = jest.spyOn(move, "preventDefault");
      content.dispatchEvent(move);

      expect(spy).toHaveBeenCalled();
    });

    it("leaves native page scrolling alone when panning is disabled (Ref #434)", () => {
      const { content, ref } = renderApp({ panning: { disabled: true } });

      fireEvent.touchStart(content, { touches: [touch(content, 200, 300)] });
      const move = touchMoveEvent(content, 200, 200, true);
      const spy = jest.spyOn(move, "preventDefault");
      content.dispatchEvent(move);

      expect(spy).not.toHaveBeenCalled();
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
  });

  describe("Ref #439", () => {
    // A controllable ResizeObserver so the late-image-load path (content
    // grows after mount) can be driven explicitly.
    const NativeResizeObserver = global.ResizeObserver;
    const observers: Array<{ callback: ResizeObserverCallback }> = [];

    beforeEach(() => {
      observers.length = 0;
      /* eslint-disable class-methods-use-this */
      global.ResizeObserver = class {
        callback: ResizeObserverCallback;

        constructor(callback: ResizeObserverCallback) {
          this.callback = callback;
          observers.push(this);
        }

        observe() {}

        disconnect() {}

        unobserve() {}
      } as unknown as typeof ResizeObserver;
      /* eslint-enable class-methods-use-this */
    });

    afterEach(() => {
      global.ResizeObserver = NativeResizeObserver;
    });

    it("re-centers automatically when the content gets its real size after mount (Ref #439)", () => {
      const { ref, content } = renderApp({
        centerOnInit: true,
        limitToBounds: false,
        contentWidth: "0px",
        contentHeight: "0px",
      });
      // Nothing to centre yet: an unloaded image measures 0 x 0.
      expect(ref.current!.instance.state.positionX).toBe(250);
      expect(observers).toHaveLength(1);

      content.style.width = "1000px";
      content.style.height = "1000px";
      act(() => {
        observers[0].callback([], {} as ResizeObserver);
      });

      expect(ref.current!.instance.state.positionX).toBe(-250);
      expect(ref.current!.instance.state.positionY).toBe(-250);
      expect(content.style.transform).toBe(
        "translate(-250px, -250px) scale(1)",
      );
    });
  });
});
