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

// jsdom doesn't implement CSS layout so offsetWidth/Height are always 0.
// This polyfill reads dimensions from inline styles, resolving percentages
// against the parent element's dimension.
let dimensionsPatched = false;
function patchOffsetDimensions() {
  if (dimensionsPatched) return;
  dimensionsPatched = true;

  function resolveDimension(
    el: HTMLElement,
    prop: "width" | "height",
    parentProp: "offsetWidth" | "offsetHeight",
  ): number {
    const val = el.style?.[prop];
    if (!val) return 0;
    if (val.endsWith("%")) {
      const pct = parseFloat(val) / 100;
      const parent = el.parentElement as HTMLElement | null;
      return parent ? Math.round(pct * parent[parentProp]) : 0;
    }
    return parseInt(val, 10) || 0;
  }

  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return resolveDimension(this, "width", "offsetWidth");
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return resolveDimension(this, "height", "offsetHeight");
    },
  });
}

/** Options shared by pan-like gesture helpers. */
export interface PanGestureOptions {
  /**
   * Horizontal displacement in pixels.
   * The gesture moves from `from.clientX` to `from.clientX + x`.
   * The resulting `translateX` change equals `x`.
   */
  x: number;
  /**
   * Vertical displacement in pixels.
   * The gesture moves from `from.clientY` to `from.clientY + y`.
   * The resulting `translateY` change equals `y`.
   */
  y: number;
  /**
   * Number of move events synthesized along the straight line from the
   * origin to `(x, y)`. Every event produces a **uniform delta** of
   * `(x / moveEventCount, y / moveEventCount)`, so the velocity seen by
   * `handleCalculateVelocity` on each tick — including the last one — is:
   *
   *     velocity = (x / moveEventCount) / msPerStep
   *
   * Use `1` (default) for non-velocity tests where you only care about
   * the final position. Use `5–10` for velocity tests.
   *
   * @default 1
   */
  moveEventCount?: number;
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
   * Simulate a mouse-driven pan gesture.
   *
   * Fires `mousedown` at `from` → N × `mousemove` (uniform deltas) →
   * `mouseup` → `blur`. The last move always lands exactly at
   * `(from.clientX + x, from.clientY + y)`.
   *
   * Without velocity (`velocityAnimation.disabled: true`, the default):
   * the content ends at exactly `translate(Xpx, Ypx)`.
   *
   * With velocity: use fake timers + `moveEventCount > 1` to get a
   * deterministic velocity, then call `flushAnimationFrames()` inside
   * `act()` to drive the inertia animation to a stable final position.
   */
  pan: (options: PanGestureOptions) => void;
  /**
   * Simulate a single-finger touch pan gesture.
   *
   * Fires `touchstart` → N × `touchmove` (uniform deltas) → `touchend`.
   * Same deterministic guarantees as {@link pan}.
   */
  touchPan: (options: PanGestureOptions) => void;
  /**
   * Simulate a trackpad/wheel-based pan gesture.
   *
   * Fires an initial zero-delta `wheel` event followed by N `wheel`
   * events, each with a uniform per-event delta of `(x/N, y/N)`.
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

  // jsdom doesn't implement CSS layout so offsetWidth/Height are always 0.
  // Patch the prototype getter to derive dimensions from inline styles.
  // This is idempotent and persists across renderApp calls.
  patchOffsetDimensions();

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
    const scaleBefore = ref.current.instance.state.scale;
    const isZoomIn = scaleBefore < value;
    const cx = center ? center[0] : 0;
    const cy = center ? center[1] : 0;

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
            clientX: cx,
            clientY: cy,
          }),
        );
      } else {
        break;
      }
    }

    // Snap to exact target when close — wheel steps use floating-point
    // arithmetic that may overshoot by a tiny amount. Only snap when the
    // scale actually moved AND is close to the target (within 5%). A large
    // gap means a limit (minScale/maxScale) was hit; don't override it.
    const scaleNow = ref.current.instance.state.scale;
    const scaleChanged = scaleNow !== scaleBefore;
    const closeToTarget =
      Math.abs(scaleNow - value) / Math.max(Math.abs(value), 1) < 0.05;
    if (scaleChanged && scaleNow !== value && closeToTarget) {
      const { positionX, positionY } = ref.current.instance.state;
      ref.current.setTransform(positionX, positionY, value, 0);
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

        // Pinch-out must narrow finger spacing (smaller dx); pinch-in widens it.
        pinchValue += isZoomIn ? newStep : -newStep;

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
    moveEventCount = 1,
    msPerStep = DEFAULT_MS_PER_STEP,
    from = { clientX: 0, clientY: 0 },
  }) => {
    userEvent.hover(content);
    fireEvent.mouseDown(content, {
      clientX: from.clientX,
      clientY: from.clientY,
      buttons: 1,
    });

    for (let i = 1; i <= moveEventCount; i++) {
      maybeAdvanceTimers(msPerStep);
      const progress = i / moveEventCount;
      fireEvent.mouseMove(content, {
        clientX: from.clientX + x * progress,
        clientY: from.clientY + y * progress,
        buttons: 1,
      });
    }

    fireEvent.mouseUp(content);
    fireEvent.blur(content);
  };

  const touchPan: RenderApp["touchPan"] = ({
    x,
    y,
    moveEventCount = 1,
    msPerStep = DEFAULT_MS_PER_STEP,
    from = { clientX: 0, clientY: 0 },
  }) => {
    waitForPreviousActionToEnd();

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

    for (let i = 1; i <= moveEventCount; i++) {
      maybeAdvanceTimers(msPerStep);
      const progress = i / moveEventCount;
      const cx = from.clientX + x * progress;
      const cy = from.clientY + y * progress;

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
    moveEventCount = 1,
    msPerStep = DEFAULT_MS_PER_STEP,
  }) => {
    if (!ref.current) throw new Error("ref.current is null");

    waitForPreviousActionToEnd();
    userEvent.hover(content);

    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaX: 0,
        deltaY: 0,
      }),
    );

    const deltaXPerEvent = -x / moveEventCount;
    const deltaYPerEvent = -y / moveEventCount;

    for (let i = 0; i < moveEventCount; i++) {
      maybeAdvanceTimers(msPerStep);
      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaX: deltaXPerEvent,
          deltaY: deltaYPerEvent,
        }),
      );
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
