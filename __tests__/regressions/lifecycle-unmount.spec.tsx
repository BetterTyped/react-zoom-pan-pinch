import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  getTransformStyles,
} from "../../src";
import { renderApp } from "../utils";

const wheel = (target: Element, deltaY: number) =>
  fireEvent(target, new WheelEvent("wheel", { bubbles: true, deltaY }));

const contentProps = (testId: string) =>
  ({ "data-testid": testId }) as React.HTMLAttributes<HTMLDivElement>;

/**
 * Before this fix `mounted` was never set to false, so every timer, animation
 * frame and callback scheduled before unmount kept running against a detached
 * tree (and into user state that no longer existed).
 */
describe("lifecycle: unmount cancels pending work", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not fire onWheelStop / onZoomStop after unmount while the wheel stop timer is pending", () => {
    jest.useFakeTimers();
    const onWheelStop = jest.fn();
    const onZoomStop = jest.fn();
    const { content, unmount } = renderApp({ onWheelStop, onZoomStop });

    wheel(content, -1);
    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onWheelStop).not.toHaveBeenCalled();
    expect(onZoomStop).not.toHaveBeenCalled();
  });

  it("does not fire onZoomStop after unmount for a programmatic zoomIn", () => {
    jest.useFakeTimers();
    const onZoomStop = jest.fn();
    const { ref, unmount } = renderApp({ onZoomStop });

    act(() => {
      ref.current!.zoomIn(0.5, 300);
    });
    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onZoomStop).not.toHaveBeenCalled();
  });

  it("does not fire the double-click onZoomStop after unmount", () => {
    jest.useFakeTimers();
    const onZoomStop = jest.fn();
    const { content, unmount } = renderApp({
      doubleClick: { disabled: false, animationTime: 200 },
      onZoomStop,
    });

    fireEvent.dblClick(content, { clientX: 10, clientY: 10 });
    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onZoomStop).not.toHaveBeenCalled();
  });

  it("stops a running animation on unmount so no transform callbacks fire afterwards", () => {
    jest.useFakeTimers();
    const onTransform = jest.fn();
    const { ref, unmount } = renderApp({ onTransform });

    act(() => {
      ref.current!.setTransform(0, 0, 2, 300);
    });
    act(() => {
      jest.advanceTimersByTime(16);
    });
    act(() => {
      jest.advanceTimersByTime(16);
    });

    // The ref callback receives null on unmount, so keep the instance.
    const { instance } = ref.current!;
    const callsBeforeUnmount = onTransform.mock.calls.length;
    const scaleAtUnmount = instance.state.scale;
    expect(callsBeforeUnmount).toBeGreaterThan(0);
    expect(scaleAtUnmount).toBeGreaterThan(1);
    expect(scaleAtUnmount).toBeLessThan(2);

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTransform.mock.calls.length).toBe(callsBeforeUnmount);
    expect(instance.state.scale).toBe(scaleAtUnmount);
    expect(instance.mounted).toBe(false);
  });

  it("removes every listener it registered on the wrapper, window and document", () => {
    const added: Array<[EventTarget, string, unknown]> = [];
    const removed: Array<[EventTarget, string, unknown]> = [];
    const originalAdd = EventTarget.prototype.addEventListener;
    const originalRemove = EventTarget.prototype.removeEventListener;

    const addSpy = jest
      .spyOn(EventTarget.prototype, "addEventListener")
      .mockImplementation(function addEventListener(
        this: EventTarget,
        type,
        listener,
        options,
      ) {
        added.push([this, type, listener]);
        return originalAdd.call(this, type, listener, options);
      });
    const removeSpy = jest
      .spyOn(EventTarget.prototype, "removeEventListener")
      .mockImplementation(function removeEventListener(
        this: EventTarget,
        type,
        listener,
        options,
      ) {
        removed.push([this, type, listener]);
        return originalRemove.call(this, type, listener, options);
      });

    try {
      const { ref, unmount } = renderApp();
      const { instance } = ref.current!;
      const handlers = new Set<unknown>([
        instance.onWheelZoom,
        instance.onWheelPanning,
        instance.onDoubleClick,
        instance.onTouchPanningStart,
        instance.onTouchPanning,
        instance.onTouchPanningStop,
        instance.onPanningStart,
        instance.onPanning,
        instance.onPanningStop,
        instance.clearPanning,
        instance.setKeyPressed,
        instance.setKeyUnPressed,
        instance.handleWindowBlur,
      ]);

      unmount();

      const ours = added.filter(([, , listener]) => handlers.has(listener));
      expect(ours.length).toBeGreaterThanOrEqual(handlers.size);

      ours.forEach(([target, type, listener]) => {
        const wasRemoved = removed.some(
          ([removedTarget, removedType, removedListener]) =>
            removedTarget === target &&
            removedType === type &&
            removedListener === listener,
        );
        expect({ type, wasRemoved }).toEqual({ type, wasRemoved: true });
      });
    } finally {
      addSpy.mockRestore();
      removeSpy.mockRestore();
    }
  });

  it("keeps working under React.StrictMode (effects mount, unmount and mount again)", () => {
    const ref = React.createRef<ReactZoomPanPinchContentRef>();
    render(
      <React.StrictMode>
        <TransformWrapper ref={ref}>
          <TransformComponent
            wrapperStyle={{ width: "500px", height: "500px" }}
            contentStyle={{ width: "1000px", height: "1000px" }}
            contentProps={contentProps("strict-content")}
          >
            <div />
          </TransformComponent>
        </TransformWrapper>
      </React.StrictMode>,
    );

    const content = screen.getByTestId("strict-content");
    expect(ref.current!.instance.mounted).toBe(true);

    wheel(content, -1);

    const { scale, positionX, positionY } = ref.current!.instance.state;
    expect(scale).toBeCloseTo(1.015, 5);
    expect(content.style.transform).toBe(
      getTransformStyles(positionX, positionY, scale),
    );
  });

  it("survives TransformComponent unmounting and mounting again (Ref #516)", () => {
    const ref = React.createRef<ReactZoomPanPinchContentRef>();

    function Toggle() {
      const [show, setShow] = useState(true);
      return (
        <TransformWrapper ref={ref}>
          <button
            type="button"
            data-testid="toggle"
            onClick={() => setShow((value) => !value)}
          >
            toggle
          </button>
          {show && (
            <TransformComponent
              wrapperStyle={{ width: "500px", height: "500px" }}
              contentStyle={{ width: "1000px", height: "1000px" }}
              contentProps={contentProps("toggle-content")}
            >
              <div />
            </TransformComponent>
          )}
        </TransformWrapper>
      );
    }

    render(<Toggle />);

    wheel(screen.getByTestId("toggle-content"), -1);
    const scaleAfterFirstWheel = ref.current!.instance.state.scale;
    expect(scaleAfterFirstWheel).toBeGreaterThan(1);

    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.queryByTestId("toggle-content")).toBeNull();
    // Controls stay callable while the component is gone.
    expect(() => ref.current!.zoomIn(0.5, 0)).not.toThrow();

    fireEvent.click(screen.getByTestId("toggle"));
    const remounted = screen.getByTestId("toggle-content");
    const scaleBeforeSecondWheel = ref.current!.instance.state.scale;

    wheel(remounted, -1);

    const { scale, positionX, positionY } = ref.current!.instance.state;
    expect(ref.current!.instance.mounted).toBe(true);
    expect(scale).toBeGreaterThan(scaleBeforeSecondWheel);
    expect(remounted.style.transform).toBe(
      getTransformStyles(positionX, positionY, scale),
    );
  });
});
