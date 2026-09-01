import { act, fireEvent } from "@testing-library/react";

import { renderApp } from "../utils";

/**
 * The animation loop stored its callback but never the rAF handle, so
 * "cancelling" an animation only nulled the callback: the already queued frame
 * still ran, applied a stale target on its last tick and re-scheduled whatever
 * animation had replaced it, doubling the frame rate of the new one.
 */
describe("animation frames", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("a replaced animation schedules exactly one frame per tick", () => {
    jest.useFakeTimers();
    const { ref } = renderApp();
    const raf = jest.spyOn(window, "requestAnimationFrame");

    act(() => {
      ref.current!.setTransform(0, 0, 2, 300);
    });
    act(() => {
      ref.current!.setTransform(0, 0, 3, 300);
    });

    raf.mockClear();
    act(() => {
      jest.advanceTimersByTime(16);
    });

    expect(raf).toHaveBeenCalledTimes(1);
    raf.mockRestore();
  });

  it("a cancelled animation does not apply its final step", () => {
    jest.useFakeTimers();
    const { ref, content } = renderApp();

    act(() => {
      ref.current!.setTransform(0, 0, 2, 100);
    });
    // Six frames in: mid-animation, with the next frame landing past the end.
    act(() => {
      jest.advanceTimersByTime(16 * 6);
    });
    const scaleWhenCancelled = ref.current!.instance.state.scale;
    expect(scaleWhenCancelled).toBeGreaterThan(1);
    expect(scaleWhenCancelled).toBeLessThan(2);

    // Starting a pan cancels any running animation.
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.mouseUp(content);

    expect(ref.current!.instance.state.scale).toBe(scaleWhenCancelled);
    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.animationFrame).toBeNull();
  });

  it("finishes exactly on the target and clears its handles", () => {
    jest.useFakeTimers();
    const { ref } = renderApp();

    act(() => {
      ref.current!.setTransform(-20, -30, 2, 100);
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: -20,
      positionY: -30,
    });
    expect(ref.current!.instance.isAnimating).toBe(false);
    expect(ref.current!.instance.animation).toBeNull();
    expect(ref.current!.instance.animationFrame).toBeNull();
  });

  it("an animation started from onTransform at the end of the previous one is not wiped out", () => {
    jest.useFakeTimers();
    let chained = false;
    const { ref } = renderApp({
      onTransform: (ctx, state) => {
        if (!chained && state.scale === 2) {
          chained = true;
          ctx.setTransform(0, 0, 3, 100);
        }
      },
    });

    act(() => {
      ref.current!.setTransform(0, 0, 2, 100);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(chained).toBe(true);
    expect(ref.current!.instance.state.scale).toBe(3);
  });
});
