import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
} from "../../src";

const INITIAL_TRANSFORM = "translate(0px, 0px) scale(1)";

function renderCanvas(props: ReactZoomPanPinchProps = {}) {
  const ref = React.createRef<ReactZoomPanPinchContentRef>();
  render(
    <TransformWrapper
      ref={ref}
      doubleClick={{ disabled: false, animationTime: 0 }}
      velocityAnimation={{ disabled: true }}
      autoAlignment={{ disabled: true }}
      {...props}
    >
      <TransformComponent
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "1000px", height: "1000px" }}
        contentProps={
          { "data-testid": "content" } as React.HTMLAttributes<HTMLDivElement>
        }
      >
        <input data-testid="input" defaultValue="type here" />
        <textarea data-testid="textarea" defaultValue="notes" />
        <select data-testid="select" defaultValue="a">
          <option value="a">a</option>
        </select>
        <div contentEditable suppressContentEditableWarning>
          <span data-testid="editable-child">nested in contenteditable</span>
        </div>
        <div draggable>
          <span data-testid="draggable-child">nested in draggable</span>
        </div>
        <div data-testid="plain">plain block</div>
      </TransformComponent>
    </TransformWrapper>,
  );
  return { ref, content: screen.getByTestId("content") };
}

const dispatchMouseDown = (element: Element) => {
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: 10,
    clientY: 10,
    button: 0,
    buttons: 1,
  });
  element.dispatchEvent(event);
  return event;
};

const dragBy = (element: Element, dx: number) => {
  fireEvent.mouseMove(element, { clientX: 10 + dx, clientY: 10, buttons: 1 });
  fireEvent.mouseUp(element);
};

const touchAt = (element: Element, x: number) => ({
  pageX: x,
  pageY: 10,
  clientX: x,
  clientY: 10,
  target: element,
});

describe("editable and draggable targets inside the canvas", () => {
  describe.each([
    ["input", "#437, #544"],
    ["textarea", "#437, #544"],
    ["select", "#437, #544"],
    ["editable-child", "#437 (nested inside contenteditable)"],
    ["draggable-child", "#460 (nested inside draggable)"],
  ])("mousedown on %s (Ref %s)", (testId) => {
    it("does not prevent default and does not start a pan", () => {
      const { ref, content } = renderCanvas();
      const element = screen.getByTestId(testId);

      const event = dispatchMouseDown(element);

      expect(event.defaultPrevented).toBe(false);
      expect(ref.current!.instance.isPanning).toBe(false);

      dragBy(element, -100);

      expect(content.style.transform).toBe(INITIAL_TRANSFORM);
    });

    it("does not start a touch pan either", () => {
      const { ref, content } = renderCanvas();
      const element = screen.getByTestId(testId);

      fireEvent.touchStart(element, { touches: [touchAt(element, 10)] });
      expect(ref.current!.instance.isPanning).toBe(false);

      fireEvent.touchMove(element, { touches: [touchAt(element, -90)] });
      fireEvent.touchEnd(element, { touches: [] });

      expect(content.style.transform).toBe(INITIAL_TRANSFORM);
    });
  });

  it("still pans from a plain element (control case)", () => {
    const { ref, content } = renderCanvas();
    const plain = screen.getByTestId("plain");

    const event = dispatchMouseDown(plain);

    expect(event.defaultPrevented).toBe(true);
    expect(ref.current!.instance.isPanning).toBe(true);

    dragBy(plain, -100);

    expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
  });

  it("does not zoom on double-click inside an input (word selection must win)", () => {
    const { ref } = renderCanvas();

    fireEvent.dblClick(screen.getByTestId("input"), {
      clientX: 10,
      clientY: 10,
    });

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("does not zoom on double-click inside a contenteditable region", () => {
    const { ref } = renderCanvas();

    fireEvent.dblClick(screen.getByTestId("editable-child"), {
      clientX: 10,
      clientY: 10,
    });

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("still zooms on double-click of a plain element (control case)", () => {
    const { ref } = renderCanvas();

    fireEvent.dblClick(screen.getByTestId("plain"), {
      clientX: 10,
      clientY: 10,
    });

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("keeps the documented panning.excluded workaround working", () => {
    const { ref, content } = renderCanvas({
      panning: { excluded: ["no-pan"] },
    });
    const plain = screen.getByTestId("plain");
    plain.classList.add("no-pan");

    const event = dispatchMouseDown(plain);

    expect(event.defaultPrevented).toBe(false);
    expect(ref.current!.instance.isPanning).toBe(false);

    dragBy(plain, -100);

    expect(content.style.transform).toBe(INITIAL_TRANSFORM);
  });
});
