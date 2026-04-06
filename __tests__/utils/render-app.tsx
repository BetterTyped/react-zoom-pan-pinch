/**
 * Test harness for react-zoom-pan-pinch.
 *
 * `renderApp` renders the {@link Example} component inside a jsdom environment
 * and returns helpers for simulating gestures (pan, touch-pan, trackpad-pan,
 * zoom, pinch) plus refs, DOM handles, and control buttons.
 *
 * ## Velocity and timing
 *
 * The library's velocity system ({@link handleCalculateVelocity} in
 * `src/core/pan/velocity.logic.ts`) uses `Date.now()` to compute the time
 * interval between consecutive move events. When all events fire in the same
 * JS tick the interval is ~0 ms, producing unstable velocity values.
 *
 * Post-pan inertia animation uses `requestAnimationFrame` + `Date.now()` (see
 * `src/core/animations/animations.utils.ts`).
 *
 * ### Deterministic mode (fake timers)
 *
 * When tests enable fake timers (`jest.useFakeTimers()`) **before** calling
 * `renderApp`, the pan/touchPan helpers automatically advance the clock by
 * {@link DEFAULT_MS_PER_STEP} between each synthesized move event, giving
 * `handleCalculateVelocity` a stable, reproducible `interval`.
 *
 * After the mouseup/touchend, call {@link flushAnimationFrames} inside
 * `act()` to deterministically drive the rAF-based velocity animation to
 * completion.
 *
 * ### Default mode (real timers)
 *
 * Without fake timers the helpers behave exactly as before — all move events
 * fire synchronously in one tick. Tests that don't care about velocity can
 * keep using the simple `pan({ x, y })` call without any timer setup.
 *
 * ## Defaults
 *
 * `renderApp` disables `doubleClick`, `velocityAnimation`, and
 * `autoAlignment` by default so baseline tests are deterministic. Override
 * these in the `props` argument when testing those features.
 */
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../../src";
import { Example } from "../examples/example";

/**
 * Default milliseconds advanced between each synthesized move event when fake
 * timers are active. 16 ms ≈ one 60 Hz frame — gives velocity logic a
 * realistic interval without coupling tests to real wall-clock time.
 */
export const DEFAULT_MS_PER_STEP = 16;

/** Options shared by pan-like gesture helpers. */
export interface PanGestureOptions {
  /** Target X position (clientX delta from gesture origin). */
  x: number;
  /** Target Y position (clientY delta from gesture origin). */
  y: number;
  /**
   * Number of intermediate `mousemove` / `touchmove` events synthesized along
   * the straight line from the origin to `(x, y)`.
   *
   * Higher values produce smoother velocity curves (more samples for
   * `handleCalculateVelocity`). Defaults to `1` for quick, non-velocity
   * tests.
   *
   * @default 1
   */
  moveEventCount?: number;
  /**
   * @deprecated Use `moveEventCount` instead. Kept for backwards compat.
   */
  steps?: number;
  /**
   * Milliseconds to advance the fake-timer clock between each move event.
   * Only applies when `jest.useFakeTimers()` is active.
   *
   * @default DEFAULT_MS_PER_STEP (16)
   */
  msPerStep?: number;
  /**
   * Starting point of the gesture in client coordinates.
   * @default { clientX: 0, clientY: 0 }
   */
  from?: { clientX: number; clientY: number };
}

/** Return type of {@link renderApp}. */
export interface RenderApp {
  ref: { current: ReactZoomPanPinchRef | null };
  renders: number;
  zoomInBtn: HTMLElement;
  zoomOutBtn: HTMLElement;
  resetBtn: HTMLElement;
  centerBtn: HTMLElement;
  content: HTMLElement;
  wrapper: HTMLElement;
  /**
   * Simulate a mouse-driven pan gesture from origin to `(x, y)`.
   *
   * Fires `mousedown` → N × `mousemove` → `mouseup` → `blur` on the
   * content element. When fake timers are active, advances the clock by
   * `msPerStep` between each move so velocity calculations are stable.
   */
  pan: (options: PanGestureOptions) => void;
  /**
   * Simulate a single-finger touch pan gesture.
   *
   * Fires `touchstart` → N × `touchmove` → `touchend`. Timer behavior
   * matches {@link pan}.
   */
  touchPan: (options: PanGestureOptions) => void;
  /**
   * Simulate a trackpad/wheel-based pan gesture.
   *
   * Fires an initial zero-delta `wheel` event followed by N intermediate
   * `wheel` events with increasing `deltaX`/`deltaY`. Timer behavior
   * matches {@link pan}.
   */
  trackPadPan: (options: PanGestureOptions) => void;
  /** Simulate wheel-driven zoom to a target scale value. */
  zoom: (options: { value: number; center?: [number, number] }) => void;
  /** Simulate a two-finger pinch gesture to a target scale value. */
  pinch: (options: {
    value: number;
    center?: [number, number];
    targetCenter?: [number, number];
  }) => void;
}

/**
 * Detect whether Jest fake timers are currently active by checking if
 * `Date.now` has been replaced by the fake implementation.
 */
function areFakeTimersActive(): boolean {
  try {
    // jest.isMockFunction is available when jest globals are in scope
    return !!(jest as any).isMockFunction(Date.now) || isDateMocked();
  } catch {
    return false;
  }
}

function isDateMocked(): boolean {
  const marker = Date.now();
  // Under fake timers, advanceTimersByTime won't change Date.now from the
  // outside, but the toString of Date.now will differ from native.
  return Date.now.toString().includes("mock") || Date.now.toString().includes("jest");
}

/**
 * Advance fake timers by `ms` milliseconds. No-op when real timers are in use.
 */
function maybeAdvanceTimers(ms: number): void {
  try {
    jest.advanceTimersByTime(ms);
  } catch {
    // Real timers — nothing to advance.
  }
}

/**
 * Synchronous busy-wait for `ms` milliseconds.
 * Used before touch/pinch gestures to let the library finish processing
 * the previous event's setTimeout-based cleanup.
 */
const waitForPreviousActionToEnd = () => {
  const startTime = Date.now();
  while (Date.now() - startTime < 10) {
    // busy wait
  }
};

/**
 * Compute two-finger touch positions for a pinch gesture.
 * Returns an array of two touch objects spread symmetrically around `center`.
 */
function getPinchTouches(
  content: HTMLElement,
  center: [number, number],
  step: number,
  from: number,
) {
  const cx = center[0];
  const cy = center[1];
  const dx = (step + from) / 2;

  return [
    {
      pageX: cx - dx,
      pageY: cy - dx,
      clientX: cx - dx,
      clientY: cy - dx,
      target: content,
    },
    {
      pageX: cx + dx,
      pageY: cy + dx,
      clientX: cx + dx,
      clientY: cy + dx,
      target: content,
    },
  ];
}

/**
 * Flush all pending `requestAnimationFrame` callbacks by repeatedly running
 * them until no more are queued, or `maxFrames` is reached. Each flush also
 * advances fake timers by `frameMs` so `Date.now()`-based animation progress
 * moves forward.
 *
 * Must be called inside `act()` so React processes state updates.
 *
 * @example
 * ```ts
 * jest.useFakeTimers();
 * const { pan, content } = renderApp({ velocityAnimation: { disabled: false } });
 * pan({ x: -100, y: 0, moveEventCount: 10 });
 * await act(async () => { flushAnimationFrames(); });
 * expect(content.style.transform).toBe(/* settled position *​/);
 * ```
 */
export function flushAnimationFrames(
  maxFrames = 120,
  frameMs = 16,
): void {
  for (let i = 0; i < maxFrames; i++) {
    maybeAdvanceTimers(frameMs);
    jest.runAllTicks();
    try {
      // Run any pending rAF callbacks. jsdom implements rAF via setTimeout
      // when fake timers are active, so advanceTimersByTime triggers them.
      jest.runAllTimers();
    } catch {
      // If no timers queued, this throws — safe to ignore.
    }
  }
}

export const renderApp = ({
  contentHeight,
  contentWidth,
  wrapperHeight,
  wrapperWidth,
  ...props
}: ReactZoomPanPinchProps & {
  contentWidth?: string;
  contentHeight?: string;
  wrapperWidth?: string;
  wrapperHeight?: string;
} = {}): RenderResult & RenderApp => {
  let renders = 0;
  const ref: { current: ReactZoomPanPinchRef | null } = { current: null };

  const onRender = () => {
    renders += 1;
  };

  const exampleProps: ReactZoomPanPinchProps = {
    doubleClick: {
      disabled: true,
    },
    velocityAnimation: {
      disabled: true,
    },
    autoAlignment: {
      disabled: true,
    },
    ...props,
    ref: (r) => {
      ref.current = r;
    },
  };

  const view = render(
    <Example
      props={exampleProps}
      onRender={onRender}
      {...{ contentHeight, contentWidth, wrapperHeight, wrapperWidth }}
    />,
  );

  const zoomInBtn = screen.getByTestId("zoom-in");
  const zoomOutBtn = screen.getByTestId("zoom-out");
  const resetBtn = screen.getByTestId("reset");
  const centerBtn = screen.getByTestId("center");
  const content = screen.getByTestId("content");
  const wrapper = screen.getByTestId("wrapper");

  const zoom: RenderApp["zoom"] = (options) => {
    const { value, center } = options;
    if (!ref.current) throw new Error("ref.current is null");

    userEvent.hover(content);
    if (center) {
      fireEvent.mouseMove(content, { clientX: center[0], clientY: center[1] });
    }

    const step = 1;
    const isZoomIn = ref.current.instance.state.scale < value;

    const startTime = Date.now();
    while (Date.now() - startTime < 1000) {
      if (
        (isZoomIn
          ? ref.current.instance.state.scale < value
          : ref.current.instance.state.scale > value) &&
        ref.current.instance.state.scale !== value
      ) {
        const isNearScale =
          Math.abs(ref.current.instance.state.scale - value) < 0.05;
        const newStep = isNearScale ? 0.4 : step;

        fireEvent(
          content,
          new WheelEvent("wheel", {
            bubbles: true,
            deltaY: isZoomIn ? -newStep : newStep,
          }),
        );
      } else {
        break;
      }
    }
  };

  const pinch: RenderApp["pinch"] = (options) => {
    const { value, center = [0, 0] } = options;
    if (!ref.current) throw new Error("ref.current is null");

    waitForPreviousActionToEnd();

    const targetCenter = options?.targetCenter || center;
    const isZoomIn = ref.current.instance.state.scale < value;
    const from = isZoomIn ? 1 : 2;
    const step = 0.1;

    let pinchValue = 0;

    fireEvent.touchStart(content, {
      touches: getPinchTouches(content, center, step, from),
    });

    const startTime = Date.now();
    while (Date.now() - startTime < 1000) {
      if (
        (isZoomIn
          ? ref.current.instance.state.scale < value
          : ref.current.instance.state.scale > value) &&
        ref.current.instance.state.scale !== value
      ) {
        const scaleDifference = Math.abs(
          ref.current.instance.state.scale - value,
        );
        const isNearScale = scaleDifference < 0.1;
        const newStep = isNearScale ? step / 6 : step;

        pinchValue += newStep;

        fireEvent.touchMove(content, {
          touches: getPinchTouches(content, center, pinchValue, from),
        });
      } else {
        break;
      }
    }

    fireEvent.touchMove(content, {
      touches: getPinchTouches(content, targetCenter, pinchValue, from),
    });

    fireEvent.touchEnd(content, {
      touches: getPinchTouches(content, center, pinchValue, from),
    });
  };

  const pan: RenderApp["pan"] = ({
    x,
    y,
    moveEventCount: count,
    steps,
    msPerStep = DEFAULT_MS_PER_STEP,
    from = { clientX: 0, clientY: 0 },
  }) => {
    const n = count ?? steps ?? 1;

    userEvent.hover(content);
    fireEvent.mouseDown(content, {
      clientX: from.clientX,
      clientY: from.clientY,
    });

    const xStep = x / n;
    const yStep = y / n;

    for (let i = 0; i < n; i++) {
      maybeAdvanceTimers(msPerStep);

      if (i < n - 1) {
        fireEvent.mouseMove(content, {
          clientX: from.clientX + xStep * i,
          clientY: from.clientY + yStep * i,
        });
      } else {
        fireEvent.mouseMove(content, {
          clientX: from.clientX + x,
          clientY: from.clientY + y,
        });
      }
    }

    fireEvent.mouseUp(content);
    fireEvent.blur(content);
  };

  const touchPan: RenderApp["touchPan"] = ({
    x,
    y,
    moveEventCount: count,
    steps,
    msPerStep = DEFAULT_MS_PER_STEP,
    from = { clientX: 0, clientY: 0 },
  }) => {
    const n = count ?? steps ?? 1;

    waitForPreviousActionToEnd();

    const xStep = x / n;
    const yStep = y / n;

    fireEvent.touchStart(content, {
      touches: [
        {
          pageX: from.clientX,
          pageY: from.clientY,
          clientX: from.clientX,
          clientY: from.clientY,
          target: content,
        },
      ],
    });

    for (let i = 0; i < n; i++) {
      maybeAdvanceTimers(msPerStep);

      const cx = i < n - 1 ? from.clientX + xStep * i : from.clientX + x;
      const cy = i < n - 1 ? from.clientY + yStep * i : from.clientY + y;

      fireEvent.touchMove(content, {
        touches: [
          {
            pageX: cx,
            pageY: cy,
            clientX: cx,
            clientY: cy,
            target: content,
          },
        ],
      });
    }

    fireEvent.touchEnd(content, {
      touches: [
        {
          pageX: from.clientX + x,
          pageY: from.clientY + y,
          clientX: from.clientX + x,
          clientY: from.clientY + y,
          target: content,
        },
      ],
    });
  };

  const trackPadPan: RenderApp["trackPadPan"] = ({
    x,
    y,
    moveEventCount: count,
    steps,
    msPerStep = DEFAULT_MS_PER_STEP,
  }) => {
    const n = count ?? steps ?? 1;

    if (!ref.current) throw new Error("ref.current is null");

    waitForPreviousActionToEnd();

    const xStep = x / n;
    const yStep = y / n;

    userEvent.hover(content);

    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaX: 0,
        deltaY: 0,
      }),
    );

    for (let i = 0; i < n; i++) {
      maybeAdvanceTimers(msPerStep);

      if (i < n - 1) {
        fireEvent(
          content,
          new WheelEvent("wheel", {
            bubbles: true,
            deltaX: -xStep * i,
            deltaY: -yStep * i,
          }),
        );
      } else {
        fireEvent(
          content,
          new WheelEvent("wheel", {
            bubbles: true,
            deltaX: -x,
            deltaY: -y,
          }),
        );
      }
    }
  };

  return {
    ...view,
    ref,
    renders,
    zoomInBtn,
    zoomOutBtn,
    resetBtn,
    centerBtn,
    content,
    wrapper,
    zoom,
    pan,
    pinch,
    touchPan,
    trackPadPan,
  };
};
