import { act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../utils";

/**
 * Ref #582 — a wheel event that arrives 100–160 ms after the previous one was
 * silently dropped. `handleWheelStop` schedules the auto-alignment animation
 * after `wheelAnimationTime` (100 ms) and that animation kept running for its
 * full duration even when it had nothing to align, overwriting the zoom that a
 * new wheel event had just applied. `handleWheelStart` only cancelled running
 * animations while `wheelStopEventTimer` (160 ms) was null, so nothing stopped
 * the stale animation inside that window.
 */
describe("regressions: wheel events inside the alignment window (Ref #582)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const wheel = (target: Element, deltaY: number) => {
    fireEvent(
      target,
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY,
        clientX: 250,
        clientY: 250,
      }),
    );
  };

  const runFrames = (frames: number) => {
    for (let i = 0; i < frames; i += 1) {
      jest.advanceTimersByTime(16);
    }
  };

  const flick = (target: Element, count: number, deltaY: number) => {
    for (let i = 0; i < count; i += 1) {
      wheel(target, deltaY);
      jest.advanceTimersByTime(18);
    }
  };

  it.each([90, 106, 121, 141])(
    "applies a wheel event that arrives %i ms after the previous flick",
    (gap) => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        smooth: true,
        wheel: { step: 0.002 },
        minScale: 1,
        maxScale: 10,
        centerOnInit: true,
        autoAlignment: { disabled: false },
      });
      const { instance } = ref.current!;

      userEvent.hover(content);
      // Six-event flick, 18 ms apart, like the reproduction in the issue.
      flick(content, 6, -150);

      // Pause inside the 100–160 ms dead band and let the animation frames
      // scheduled during the pause run.
      act(() => {
        const frames = Math.floor(gap / 16);
        runFrames(frames);
        jest.advanceTimersByTime(gap - frames * 16);
      });

      const before = instance.state.scale;
      wheel(content, -150);
      // The next animation frame is where the stale alignment used to
      // overwrite the zoom.
      act(() => {
        runFrames(1);
      });

      expect(instance.state.scale).toBeGreaterThan(before);
      expect(instance.state.scale).toBeCloseTo(before + 0.3, 5);
    },
  );

  it("still applies wheel events after the stop timer has elapsed", () => {
    jest.useFakeTimers();
    const { content, ref } = renderApp({
      smooth: true,
      wheel: { step: 0.002 },
      minScale: 1,
      maxScale: 10,
      autoAlignment: { disabled: false },
    });
    const { instance } = ref.current!;

    userEvent.hover(content);
    flick(content, 6, -150);
    act(() => {
      runFrames(20);
    });

    const before = instance.state.scale;
    wheel(content, 150);
    act(() => {
      runFrames(1);
    });

    expect(instance.state.scale).toBeCloseTo(before - 0.3, 5);
  });
});
