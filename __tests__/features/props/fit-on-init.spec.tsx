import { act } from "@testing-library/react";

import { renderApp } from "../../utils";

const wrapper = { wrapperWidth: "500px", wrapperHeight: "500px" };
const wide = { ...wrapper, contentWidth: "2000px", contentHeight: "1000px" };
const small = { ...wrapper, contentWidth: "100px", contentHeight: "50px" };

/**
 * fitOnInit (#252, dupes #376, #530): the first layout is the fitted one, and
 * resetTransform goes back to it.
 */
describe("fitOnInit prop (#252)", () => {
  it("does nothing when off", () => {
    const { content } = renderApp({ ...wide, minScale: 0.1 });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("fits (contain) before the first paint", () => {
    const { content, ref } = renderApp({
      ...wide,
      minScale: 0.1,
      fitOnInit: true,
    });

    expect(content.style.transform).toBe("translate(0px, 125px) scale(0.25)");
    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.25,
      positionX: 0,
      positionY: 125,
    });
  });

  it("accepts 'contain' and 'cover' explicitly", () => {
    const contain = renderApp({ ...wide, minScale: 0.1, fitOnInit: "contain" });
    expect(contain.ref.current!.instance.state.scale).toBe(0.25);
    contain.unmount();

    const cover = renderApp({ ...wide, minScale: 0.1, fitOnInit: "cover" });
    expect(cover.ref.current!.instance.state).toMatchObject({
      scale: 0.5,
      positionX: -250,
      positionY: 0,
    });
  });

  it("takes precedence over centerOnInit", () => {
    const { ref } = renderApp({
      ...wide,
      minScale: 0.1,
      fitOnInit: true,
      centerOnInit: true,
    });

    expect(ref.current!.instance.state.scale).toBe(0.25);
  });

  it("honours minScale (default 1 keeps large content at scale 1, centred)", () => {
    const { ref } = renderApp({ ...wide, fitOnInit: true });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 1,
      positionX: -750,
      positionY: -250,
    });
  });

  it("upscales small content up to maxScale", () => {
    const fitted = renderApp({ ...small, fitOnInit: true });
    expect(fitted.ref.current!.instance.state.scale).toBe(5);
    fitted.unmount();

    const capped = renderApp({ ...small, fitOnInit: true, maxScale: 2 });
    expect(capped.ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: 150,
      positionY: 200,
    });
  });

  it("resetTransform returns to the fitted layout", async () => {
    const { ref, pan } = renderApp({ ...wide, minScale: 0.1, fitOnInit: true });

    act(() => {
      ref.current!.setTransform(-100, -50, 0.4, 0);
    });
    pan({ x: -30, y: 0 });
    expect(ref.current!.instance.state.scale).toBe(0.4);

    await act(async () => {
      await ref.current!.resetTransform(0);
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.25,
      positionX: 0,
      positionY: 125,
    });
  });

  it("resetTransform is a silent no-op when already fitted", async () => {
    const onZoomStart = jest.fn();
    const { ref } = renderApp({
      ...wide,
      minScale: 0.1,
      fitOnInit: true,
      onZoomStart,
    });

    await act(async () => {
      await ref.current!.resetTransform(0);
    });

    expect(onZoomStart).not.toHaveBeenCalled();
    expect(ref.current!.instance.state.scale).toBe(0.25);
  });

  it("re-fits once the content gets its size (e.g. an image finished loading)", () => {
    const callbacks: ResizeObserverCallback[] = [];
    const Original = global.ResizeObserver;
    // A silent observer: nothing fires until the test triggers it by hand.
    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
      callbacks.push(cb);
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as unknown as typeof ResizeObserver;

    try {
      const { ref, content } = renderApp({
        ...wrapper,
        contentWidth: "0px",
        contentHeight: "0px",
        minScale: 0.1,
        fitOnInit: true,
      });
      // Nothing to fit yet: the content has no size.
      expect(ref.current!.instance.state.scale).toBe(1);
      expect(callbacks).toHaveLength(1);

      content.style.width = "2000px";
      content.style.height = "1000px";
      act(() => {
        callbacks[0]([], {} as ResizeObserver);
      });

      expect(ref.current!.instance.state).toMatchObject({
        scale: 0.25,
        positionX: 0,
        positionY: 125,
      });
    } finally {
      global.ResizeObserver = Original;
    }
  });

  it("waits for the wrapper to be laid out as well (hidden tab, collapsed panel)", () => {
    const callbacks: ResizeObserverCallback[] = [];
    const Original = global.ResizeObserver;
    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
      callbacks.push(cb);
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as unknown as typeof ResizeObserver;

    try {
      const { ref, wrapper: wrapperEl } = renderApp({
        wrapperWidth: "0px",
        wrapperHeight: "0px",
        contentWidth: "2000px",
        contentHeight: "1000px",
        minScale: 0.1,
        fitOnInit: true,
      });
      // The content has a size but the wrapper does not: nothing to fit yet.
      expect(ref.current!.instance.state.scale).toBe(1);

      // A notification while the wrapper is still 0px must keep waiting…
      act(() => {
        callbacks[0]([], {} as ResizeObserver);
      });
      expect(ref.current!.instance.state.scale).toBe(1);

      // …and the fit is applied once the wrapper gets its size.
      wrapperEl.style.width = "500px";
      wrapperEl.style.height = "500px";
      act(() => {
        callbacks[0]([], {} as ResizeObserver);
      });
      expect(ref.current!.instance.state).toMatchObject({
        scale: 0.25,
        positionX: 0,
        positionY: 125,
      });
    } finally {
      global.ResizeObserver = Original;
    }
  });

  it("keeps waiting for the first real layout even past the 5 s give-up (hidden tab)", () => {
    jest.useFakeTimers();
    const callbacks: ResizeObserverCallback[] = [];
    const Original = global.ResizeObserver;
    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
      callbacks.push(cb);
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as unknown as typeof ResizeObserver;

    try {
      const { ref, content } = renderApp({
        ...wrapper,
        contentWidth: "0px",
        contentHeight: "0px",
        minScale: 0.1,
        fitOnInit: true,
      });
      expect(ref.current!.instance.state.scale).toBe(1);

      // A background tab delivers no observer callbacks; far more than the
      // give-up time passes before the image reports its size.
      act(() => {
        jest.advanceTimersByTime(20000);
      });
      content.style.width = "2000px";
      content.style.height = "1000px";
      act(() => {
        callbacks[0]([], {} as ResizeObserver);
      });

      expect(ref.current!.instance.state).toMatchObject({
        scale: 0.25,
        positionX: 0,
        positionY: 125,
      });
    } finally {
      global.ResizeObserver = Original;
      jest.useRealTimers();
    }
  });

  it("gives up re-fitting 5 s after a real initial layout (a later size change aligns instead)", () => {
    jest.useFakeTimers();
    const callbacks: ResizeObserverCallback[] = [];
    const Original = global.ResizeObserver;
    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
      callbacks.push(cb);
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as unknown as typeof ResizeObserver;

    try {
      const { ref, content } = renderApp({
        ...wide,
        minScale: 0.1,
        fitOnInit: true,
        autoAlignment: { disabled: false, animationTime: 0 },
      });
      // A real initial layout happened, the give-up timer is running.
      expect(ref.current!.instance.state.scale).toBe(0.25);
      expect(ref.current!.instance.isInitialLayoutPending).toBe(true);

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(ref.current!.instance.isInitialLayoutPending).toBe(false);

      // The content grows later: no re-fit, the scale stays.
      content.style.width = "4000px";
      content.style.height = "2000px";
      act(() => {
        callbacks[0]([], {} as ResizeObserver);
      });
      expect(ref.current!.instance.state.scale).toBe(0.25);
    } finally {
      global.ResizeObserver = Original;
      jest.useRealTimers();
    }
  });

  it("wheel zoom keeps working from the fitted state", () => {
    const { ref, zoom } = renderApp({
      ...wide,
      minScale: 0.1,
      fitOnInit: true,
    });

    zoom({ value: 0.5 });

    expect(ref.current!.instance.state.scale).toBeCloseTo(0.5, 5);
  });
});
