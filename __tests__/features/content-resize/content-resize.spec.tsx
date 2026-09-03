import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../../src";
import { renderApp, flushAnimationFrames } from "../../utils";

/**
 * Bounds must follow the content and the wrapper when they change size after
 * mount: children re-rendering with another size, an image loading, or the
 * viewport resizing. A transform that ends up outside the fresh bounds is
 * animated back into place.
 *
 * jsdom has no layout and no ResizeObserver, so the observer is a
 * controllable stub: tests change the inline sizes and then deliver the
 * notification themselves.
 */
describe("content and wrapper resize", () => {
  const NativeResizeObserver = global.ResizeObserver;
  const observers: Array<{
    callback: ResizeObserverCallback;
    observed: Element[];
    disconnect: jest.Mock;
  }> = [];

  const notify = () =>
    act(() => {
      observers.forEach((observer) =>
        observer.callback([], {} as ResizeObserver),
      );
    });

  const advanceFrame = () =>
    act(() => {
      jest.advanceTimersByTime(16);
    });

  beforeEach(() => {
    jest.useFakeTimers();
    observers.length = 0;
    /* eslint-disable class-methods-use-this */
    global.ResizeObserver = class {
      callback: ResizeObserverCallback;

      observed: Element[] = [];

      disconnect = jest.fn();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }

      observe(target: Element) {
        this.observed.push(target);
      }

      unobserve() {}
    } as unknown as typeof ResizeObserver;
    /* eslint-enable class-methods-use-this */
  });

  afterEach(() => {
    global.ResizeObserver = NativeResizeObserver;
    jest.useRealTimers();
  });

  // wrapper 500 x 500, content 1000 x 500 => x bounds [-500, 0]
  const renderOverflowing = (props = {}) =>
    renderApp({
      contentWidth: "1000px",
      limitToBounds: true,
      disablePadding: true,
      ...props,
    });

  it("observes both the wrapper and the content", () => {
    const { wrapper, content } = renderOverflowing();

    expect(observers).toHaveLength(1);
    expect(observers[0].observed).toEqual([wrapper, content]);
  });

  it("animates the content back to the new edge when it shrinks while panned to its far edge", () => {
    const { ref, content, pan } = renderOverflowing();

    pan({ x: -600, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(-500);

    content.style.width = "700px";
    notify();

    // Animated, not snapped: nothing moved before the first frame ran.
    expect(ref.current!.instance.state.positionX).toBe(-500);
    expect(ref.current!.instance.animation).not.toBeNull();
    expect(ref.current!.instance.bounds!.minPositionX).toBe(-200);

    act(() => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.state.positionX).toBe(-200);
    expect(ref.current!.instance.state.positionY).toBe(0);
    expect(ref.current!.instance.state.scale).toBe(1);
    expect(content.style.transform).toBe("translate(-200px, 0px) scale(1)");
  });

  it("passes through intermediate positions, so the move is an animation", () => {
    const seen: number[] = [];
    const { ref, content, pan } = renderOverflowing({
      onTransform: (_: ReactZoomPanPinchRef, state: { positionX: number }) => {
        seen.push(state.positionX);
      },
    });

    pan({ x: -600, y: 0 });
    seen.length = 0;

    content.style.width = "700px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.state.positionX).toBe(-200);
    const between = seen.filter((x) => x > -500 && x < -200);
    expect(between.length).toBeGreaterThan(0);
  });

  it("uses the autoAlignment animation settings", () => {
    const { ref, content, pan } = renderOverflowing({
      autoAlignment: { disabled: true, animationTime: 0 },
    });

    pan({ x: -600, y: 0 });

    content.style.width = "700px";
    notify();

    // animationTime 0 applies the aligned state synchronously.
    expect(ref.current!.instance.state.positionX).toBe(-200);
    expect(ref.current!.instance.animation).toBeNull();
  });

  it("centres content that became smaller than the wrapper with centerZoomedOut", () => {
    const { ref, content, pan } = renderOverflowing({ centerZoomedOut: true });

    pan({ x: -600, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(-500);

    content.style.width = "300px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    // (500 - 300) / 2
    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(ref.current!.instance.state.positionY).toBe(0);
  });

  it("realigns when the wrapper grows and uncovers empty space", () => {
    const { ref, wrapper, pan } = renderOverflowing();

    pan({ x: -600, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(-500);

    wrapper.style.width = "800px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    // 800 - 1000
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("realigns the content when it grows on both axes at a zoomed-in scale", () => {
    // wrapper 500 x 500, content 500 x 500 at scale 2 => bounds [-500, 0]
    const { ref, content } = renderApp({
      limitToBounds: true,
      disablePadding: true,
    });
    ref.current!.setTransform(-500, -500, 2, 0);

    // 400 x 400 at scale 2 => 800 x 800 => bounds [-300, 0]
    content.style.width = "400px";
    content.style.height = "400px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: -300,
      positionY: -300,
    });
  });

  it("keeps following the bound while the size keeps changing, without a jump", () => {
    const { ref, content, pan } = renderOverflowing();
    pan({ x: -600, y: 0 });

    content.style.width = "700px";
    notify();
    expect(ref.current!.instance.animation).not.toBeNull();

    // A few frames in: part of the way from -500 towards -200.
    act(() => {
      jest.advanceTimersByTime(48);
    });
    const midway = ref.current!.instance.state.positionX;
    expect(midway).toBeLessThan(-200);
    expect(midway).toBeGreaterThan(-500);

    // The content shrinks further: nothing moves at the hand-over …
    content.style.width = "600px";
    notify();
    expect(ref.current!.instance.animation).not.toBeNull();
    expect(ref.current!.instance.state.positionX).toBe(midway);
    expect(ref.current!.instance.isResizeAlignmentPending).toBe(false);

    // … and every following frame is a small step, never a burst.
    const steps: number[] = [];
    let previous = midway;
    const readStep = () => {
      const { positionX } = ref.current!.instance.state;
      steps.push(positionX - previous);
      previous = positionX;
    };
    for (let i = 0; i < 20; i += 1) {
      advanceFrame();
      readStep();
    }
    expect(Math.max(...steps)).toBeLessThan(80);
    expect(steps.every((step) => step >= 0)).toBe(true);

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(-100);
    expect(ref.current!.instance.animation).toBeNull();
  });

  it("settles a one-off step within the autoAlignment animation time", () => {
    const { ref, content, pan } = renderOverflowing({
      autoAlignment: { disabled: true, animationTime: 200 },
    });
    pan({ x: -600, y: 0 });

    content.style.width = "700px";
    notify();
    act(() => {
      jest.advanceTimersByTime(100);
    });
    // Half-way through the time budget most of the gap is closed …
    expect(ref.current!.instance.state.positionX).toBeGreaterThan(-260);
    expect(ref.current!.instance.state.positionX).toBeLessThan(-200);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    // … and it rests exactly on the bound afterwards.
    expect(ref.current!.instance.state.positionX).toBe(-200);
    expect(ref.current!.instance.animation).toBeNull();
  });

  it("stops the alignment when the content grows back into bounds mid-animation", () => {
    const { ref, content, pan } = renderOverflowing();
    pan({ x: -600, y: 0 });

    content.style.width = "700px";
    notify();
    act(() => {
      jest.advanceTimersByTime(48);
    });
    const midway = ref.current!.instance.state.positionX;
    expect(midway).toBeGreaterThan(-500);

    content.style.width = "1000px";
    notify();

    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.state.positionX).toBe(midway);

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(midway);
  });

  it("does nothing when a notification carries no size change", () => {
    const { ref, pan } = renderOverflowing();

    pan({ x: -600, y: 0 });
    notify();

    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.state.positionX).toBe(-500);
  });

  it("does not move an explicit initial position on the observer's first delivery", () => {
    // content 100 % of the wrapper => bounds [0, 0]; -100 is outside them.
    const { ref } = renderApp({
      initialPositionX: -100,
      limitToBounds: true,
      disablePadding: true,
    });
    notify();

    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.state.positionX).toBe(-100);
  });

  it("only refreshes the bounds when limitToBounds is off", () => {
    const { ref, content, pan } = renderOverflowing({ limitToBounds: false });

    pan({ x: -600, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(-600);

    content.style.width = "700px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.bounds!.minPositionX).toBe(-200);
    expect(ref.current!.instance.state.positionX).toBe(-600);
  });

  it("only refreshes the bounds when the wrapper is disabled", () => {
    const { ref, content, pan } = renderOverflowing();

    pan({ x: -600, y: 0 });
    ref.current!.instance.setup.disabled = true;

    content.style.width = "700px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    expect(ref.current!.instance.bounds!.minPositionX).toBe(-200);
    expect(ref.current!.instance.state.positionX).toBe(-500);
  });

  it("leaves a pan in progress alone: no jump, and one alignment animation on release", () => {
    const { ref, content } = renderOverflowing({
      autoAlignment: { disabled: false },
    });

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: -300, clientY: 0, buttons: 1 });
    expect(ref.current!.instance.state.positionX).toBe(-300);

    content.style.width = "700px";
    notify();

    // Nothing moved and the gesture keeps the bounds it started with.
    expect(ref.current!.instance.isPanning).toBe(true);
    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.state.positionX).toBe(-300);
    expect(ref.current!.instance.bounds!.minPositionX).toBe(-500);
    expect(ref.current!.instance.isResizeAlignmentPending).toBe(true);

    // The drag still clamps at the old limit instead of jumping to -200.
    fireEvent.mouseMove(content, { clientX: -600, clientY: 0, buttons: 1 });
    expect(ref.current!.instance.state.positionX).toBe(-500);

    // Release: the usual alignment animation, aimed at the fresh bound.
    fireEvent.mouseUp(content);
    expect(ref.current!.instance.state.positionX).toBe(-500);
    expect(ref.current!.instance.animation).not.toBeNull();
    expect(ref.current!.instance.bounds!.minPositionX).toBe(-200);

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(-200);
    expect(ref.current!.instance.isResizeAlignmentPending).toBe(false);
  });

  it("aligns on release even when autoAlignment is disabled", () => {
    const { ref, content } = renderOverflowing();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: -500, clientY: 0, buttons: 1 });
    content.style.width = "700px";
    notify();
    expect(ref.current!.instance.state.positionX).toBe(-500);

    fireEvent.mouseUp(content);
    expect(ref.current!.instance.state.positionX).toBe(-500);
    expect(ref.current!.instance.animation).not.toBeNull();

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("aligns immediately while a trackpad sequence is running", () => {
    const { ref, content } = renderOverflowing({
      wheel: { disabled: true },
      trackPadPanning: { disabled: false },
    });
    const wheel = (deltaX: number) =>
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaX, deltaY: 0 }),
      );

    wheel(300);
    expect(ref.current!.instance.state.positionX).toBe(-300);
    expect(ref.current!.instance.wheelAnimationTimer).not.toBeNull();

    // The layout collapses mid-scroll: fresh bounds and the move starts now.
    // 400 px of content fit the 500 px wrapper: with padding disabled the
    // only allowed position is 0.
    content.style.width = "400px";
    notify();
    expect(ref.current!.instance.bounds!.minPositionX).toBe(0);
    expect(ref.current!.instance.bounds!.maxPositionX).toBe(0);
    expect(ref.current!.instance.animation).not.toBeNull();
    expect(ref.current!.instance.isResizeAlignmentPending).toBe(false);

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(0);
  });

  it("cancels a move in flight so the resize takes effect immediately", async () => {
    const { ref, content } = renderOverflowing();
    ref.current!.setTransform(-500, 0, 1, 0);

    const move = ref.current!.setTransform(-400, 0, 1, 300);
    const inFlight = ref.current!.instance.animation;
    expect(inFlight).not.toBeNull();

    content.style.width = "700px";
    notify();

    // The move is gone (its promise settled) and the alignment runs instead.
    expect(ref.current!.instance.animation).not.toBe(inFlight);
    expect(ref.current!.instance.animation).not.toBeNull();
    await expect(move).resolves.toBeUndefined();

    act(() => {
      flushAnimationFrames();
    });
    expect(ref.current!.instance.state.positionX).toBe(-200);
    expect(ref.current!.instance.isResizeAlignmentPending).toBe(false);
  });

  it("aligns after the initial layout has settled instead of re-centring (centerOnInit)", () => {
    const { ref, content, pan } = renderOverflowing({ centerOnInit: true });
    // centred: (500 - 1000) / 2
    expect(ref.current!.instance.state.positionX).toBe(-250);

    // The observer's initial delivery finishes the initial layout.
    notify();
    expect(ref.current!.instance.isInitialLayoutPending).toBe(false);

    pan({ x: -600, y: 0 });
    expect(ref.current!.instance.state.positionX).toBe(-500);

    content.style.width = "700px";
    notify();
    act(() => {
      flushAnimationFrames();
    });

    // Aligned to the new edge, not re-centred to -100.
    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("stops waiting for the initial layout after 5 seconds", () => {
    const { ref } = renderOverflowing({ centerOnInit: true });
    expect(ref.current!.instance.isInitialLayoutPending).toBe(true);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(ref.current!.instance.isInitialLayoutPending).toBe(false);
  });

  it("realigns after children re-render with a different size", () => {
    const ref = React.createRef<ReactZoomPanPinchRef>();

    function Board() {
      const [wide, setWide] = useState(true);
      return (
        <TransformWrapper
          ref={ref}
          limitToBounds
          disablePadding
          autoAlignment={{ animationTime: 0 }}
        >
          <button
            type="button"
            data-testid="shrink"
            onClick={() => setWide(false)}
          >
            shrink
          </button>
          <TransformComponent
            wrapperStyle={{ width: "500px", height: "500px" }}
            contentStyle={{ width: wide ? "1000px" : "700px", height: "500px" }}
          >
            <div />
          </TransformComponent>
        </TransformWrapper>
      );
    }

    render(<Board />);
    ref.current!.setTransform(-500, 0, 1, 0);
    expect(ref.current!.instance.state.positionX).toBe(-500);

    fireEvent.click(screen.getByTestId("shrink"));
    notify();

    expect(ref.current!.instance.state.positionX).toBe(-200);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderOverflowing();
    const [observer] = observers;

    unmount();

    expect(observer.disconnect).toHaveBeenCalled();
  });
});
