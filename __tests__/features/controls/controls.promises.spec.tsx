import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

/** Advance exactly `n` 16 ms frames (flushAnimationFrames runs everything). */
const frames = (n: number) => {
  for (let i = 0; i < n; i += 1) {
    jest.advanceTimersByTime(16);
  }
};

const size = {
  wrapperWidth: "500px",
  wrapperHeight: "500px",
  contentWidth: "1000px",
  contentHeight: "1000px",
};

/**
 * Every programmatic control returns a promise that settles when its
 * animation is done (#214). The promise also settles when the animation is
 * interrupted or the component unmounts, so awaiting it is always safe.
 */
describe("programmatic controls return completion promises (#214)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const settled = (promise: Promise<unknown>) => {
    let done = false;
    promise.then(() => {
      done = true;
    });
    return () => done;
  };

  it("zoomIn resolves after the animation reaches the target scale", async () => {
    jest.useFakeTimers();
    const { ref } = renderApp(size);

    let promise!: Promise<void>;
    act(() => {
      promise = ref.current!.zoomIn(0.5, 200);
    });
    const isDone = settled(promise);

    await act(async () => {
      frames(2);
    });
    expect(isDone()).toBe(false);
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    expect(ref.current!.instance.state.scale).toBeLessThan(1.5);

    await act(async () => {
      flushAnimationFrames(30);
    });
    await promise;

    expect(isDone()).toBe(true);
    expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 5);
  });

  it("resolves immediately for a zero-length animation", async () => {
    const { ref } = renderApp(size);

    await act(async () => {
      await ref.current!.zoomIn(0.25, 0);
    });

    expect(ref.current!.instance.state.scale).toBe(1.25);
  });

  it("setTransform, centerView and resetTransform resolve with the final state", async () => {
    jest.useFakeTimers();
    const { ref } = renderApp(size);

    let promise!: Promise<void>;
    act(() => {
      promise = ref.current!.setTransform(-100, -50, 2, 100);
    });
    await act(async () => {
      flushAnimationFrames(20);
    });
    await promise;
    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: -100,
      positionY: -50,
    });

    act(() => {
      promise = ref.current!.centerView(2, 100);
    });
    await act(async () => {
      flushAnimationFrames(20);
    });
    await promise;
    // Content 1000 at scale 2 centred in 500: (500 - 2000) / 2 = -750.
    expect(ref.current!.instance.state).toMatchObject({
      positionX: -750,
      positionY: -750,
    });

    act(() => {
      promise = ref.current!.resetTransform(100);
    });
    await act(async () => {
      flushAnimationFrames(20);
    });
    await promise;
    expect(ref.current!.instance.state).toMatchObject({
      scale: 1,
      positionX: 0,
      positionY: 0,
    });
  });

  it("resetTransform resolves right away when there is nothing to reset", async () => {
    const { ref } = renderApp(size);

    await act(async () => {
      await ref.current!.resetTransform(500);
    });

    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("an interrupted animation settles instead of hanging", async () => {
    jest.useFakeTimers();
    const { ref } = renderApp(size);

    let first!: Promise<void>;
    let second!: Promise<void>;
    act(() => {
      first = ref.current!.zoomIn(1, 1000);
    });
    const firstDone = settled(first);

    await act(async () => {
      frames(2);
    });
    expect(firstDone()).toBe(false);

    act(() => {
      second = ref.current!.centerView(1, 100);
    });
    await first;
    expect(firstDone()).toBe(true);

    await act(async () => {
      flushAnimationFrames(20);
    });
    await second;
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("a wheel gesture interrupting the animation settles the promise", async () => {
    jest.useFakeTimers();
    const { ref, zoom } = renderApp(size);

    let promise!: Promise<void>;
    act(() => {
      promise = ref.current!.zoomIn(1, 1000);
    });
    const isDone = settled(promise);
    await act(async () => {
      frames(2);
    });
    expect(isDone()).toBe(false);

    act(() => {
      zoom({ value: 1.2 });
    });
    await promise;

    expect(isDone()).toBe(true);
  });

  it("unmounting settles a pending promise", async () => {
    jest.useFakeTimers();
    const view = renderApp(size);

    let promise!: Promise<void>;
    act(() => {
      promise = view.ref.current!.zoomIn(1, 1000);
    });
    const isDone = settled(promise);
    await act(async () => {
      frames(1);
    });

    view.unmount();
    await promise;

    expect(isDone()).toBe(true);
  });
});
