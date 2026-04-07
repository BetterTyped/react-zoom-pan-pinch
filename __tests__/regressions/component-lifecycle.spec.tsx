import React, { useState } from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "../../src";
import { renderApp } from "../utils";

function DeferredMount() {
  const [show, setShow] = useState(false);
  return (
    <TransformWrapper>
      <button type="button" data-testid="toggle" onClick={() => setShow(true)}>
        Show
      </button>
      {show && (
        <TransformComponent>
          <div data-testid="content516">Content</div>
        </TransformComponent>
      )}
    </TransformWrapper>
  );
}

function PanWithParentRerender() {
  const [, setTick] = useState(0);
  return (
    <TransformWrapper onPanning={() => setTick((n) => n + 1)}>
      <TransformComponent
        wrapperProps={
          {
            "data-testid": "wrapper427",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        contentProps={
          {
            "data-testid": "content427",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        wrapperStyle={{ width: "500px", height: "500px" }}
      >
        <div />
      </TransformComponent>
    </TransformWrapper>
  );
}

describe("component lifecycle regressions", () => {
  it("allows TransformComponent to mount after TransformWrapper (Ref #516)", () => {
    render(<DeferredMount />);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("content516")).toBeTruthy();
  });

  it("pan completes when onPanning triggers a parent re-render (Ref #427)", () => {
    render(<PanWithParentRerender />);
    const content = screen.getByTestId("content427");
    const before = content.style.transform;

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 140, clientY: 120, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 190, clientY: 145, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(content.style.transform).not.toBe(before);
    expect(content.style.transform).toMatch(/translate\(/);
  });

  it("zoomToElement centers the target at the requested scale (Ref #283)", () => {
    const ref: { current: ReactZoomPanPinchContentRef | null } = {
      current: null,
    };

    render(
      <TransformWrapper
        ref={(r) => {
          ref.current = r;
        }}
        limitToBounds={false}
      >
        <TransformComponent
          wrapperProps={
            {
              "data-testid": "wrap283",
            } as React.HTMLAttributes<HTMLDivElement>
          }
          contentProps={
            {
              "data-testid": "target283",
            } as React.HTMLAttributes<HTMLDivElement>
          }
          wrapperStyle={{ width: "400px", height: "400px" }}
        >
          <div style={{ width: "100px", height: "100px" }} />
        </TransformComponent>
      </TransformWrapper>,
    );

    const wrapper = screen.getByTestId("wrap283");
    const target = screen.getByTestId("target283");

    jest.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      width: 400,
      height: 400,
      top: 0,
      left: 0,
      bottom: 400,
      right: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    jest.spyOn(target, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 100,
      top: 50,
      left: 50,
      bottom: 150,
      right: 150,
      x: 50,
      y: 50,
      toJSON: () => ({}),
    } as DOMRect);

    act(() => {
      ref.current!.zoomToElement(target, 2, 0);
    });

    expect(ref.current!.instance.state.scale).toBe(2);
    expect(ref.current!.instance.state.positionX).toBeCloseTo(100, 0);
    expect(ref.current!.instance.state.positionY).toBeCloseTo(100, 0);
  });

  it("handles zero dimensions without crashing when mounted in hidden container (Ref #479)", () => {
    const origRO = global.ResizeObserver;
    /* eslint-disable class-methods-use-this */
    global.ResizeObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    } as unknown as typeof ResizeObserver;
    /* eslint-enable class-methods-use-this */

    const { ref, wrapper, content } = renderApp({
      centerOnInit: true,
      limitToBounds: false,
    });

    jest.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    jest.spyOn(content, "getBoundingClientRect").mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    expect(() => {
      ref.current!.zoomIn(1, 0);
    }).not.toThrow();

    jest.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      width: 500,
      height: 500,
      top: 0,
      left: 0,
      bottom: 500,
      right: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    jest.spyOn(content, "getBoundingClientRect").mockReturnValue({
      width: 500,
      height: 500,
      top: 0,
      left: 0,
      bottom: 500,
      right: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    ref.current!.centerView(1, 0);
    const { scale } = ref.current!.instance.state;
    expect(scale).toBe(1);
    global.ResizeObserver = origRO;
  });

  it("scale stays stable when the wrapper size changes (Ref #364)", async () => {
    const { ref, wrapper, zoom } = renderApp();

    zoom({ value: 2 });
    await waitFor(() => {
      expect(ref.current!.instance.state.scale).toBe(2);
    });

    const scaleBeforeResize = ref.current!.instance.state.scale;

    Object.defineProperty(wrapper, "offsetWidth", {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(wrapper, "offsetHeight", {
      configurable: true,
      value: 300,
    });

    await act(async () => {
      window.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      expect(ref.current!.instance.state.scale).toBe(scaleBeforeResize);
    });
  });
});
