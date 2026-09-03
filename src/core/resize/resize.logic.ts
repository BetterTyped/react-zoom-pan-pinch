/* eslint-disable no-param-reassign */
import { ReactZoomPanPinchContext, StateType } from "../../models";
import { roundNumber } from "../../utils";
import { handleCancelAnimation } from "../animations/animations.utils";
import {
  getMouseBoundedPosition,
  handleCalculateBounds,
} from "../bounds/bounds.utils";
import { MeasuredSizesType } from "./resize.types";

export const measureSizes = (
  wrapperComponent: HTMLElement,
  contentComponent: HTMLElement,
): MeasuredSizesType => ({
  wrapperWidth: wrapperComponent.offsetWidth,
  wrapperHeight: wrapperComponent.offsetHeight,
  contentWidth: contentComponent.offsetWidth,
  contentHeight: contentComponent.offsetHeight,
});

export const hasSizeChanged = (
  previous: MeasuredSizesType | null,
  current: MeasuredSizesType,
): boolean =>
  !previous ||
  previous.wrapperWidth !== current.wrapperWidth ||
  previous.wrapperHeight !== current.wrapperHeight ||
  previous.contentWidth !== current.contentWidth ||
  previous.contentHeight !== current.contentHeight;

/**
 * A pointer is physically held: a mouse/touch pan or a pinch. The bounds
 * belong to that gesture until it is released (moving the content under a
 * held cursor is what feels like a jump).
 */
export const isPointerGestureActive = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => contextInstance.isPanning || contextInstance.isPinching;

/**
 * Any gesture is in progress: a held pointer, or a wheel sequence whose stop
 * timers have not fired yet.
 */
export const isGestureActive = (
  contextInstance: ReactZoomPanPinchContext,
): boolean =>
  isPointerGestureActive(contextInstance) ||
  contextInstance.wheelStopEventTimer !== null ||
  contextInstance.wheelAnimationTimer !== null;

/**
 * Recomputes the bounds for the current scale and content/wrapper sizes and
 * returns the state the transform has to move to so it sits inside them.
 * Returns `null` when the transform is already inside the bounds or when
 * nothing limits it (`limitToBounds` and `centerZoomedOut` both off).
 *
 * The bounds are stored on the instance as a side effect, so gestures that
 * follow a resize clamp against the fresh sizes even when no move is needed.
 */
export function calculateResizeAlignment(
  contextInstance: ReactZoomPanPinchContext,
): StateType | null {
  const { wrapperComponent, contentComponent, setup, state } = contextInstance;
  if (!wrapperComponent || !contentComponent) return null;

  const bounds = handleCalculateBounds(contextInstance, state.scale);

  // Same rule as the post-pan alignment (`handlePanToBounds`).
  const { limitToBounds, centerZoomedOut } = setup;
  if (!limitToBounds && !centerZoomedOut) return null;

  const { x, y } = getMouseBoundedPosition(
    state.positionX,
    state.positionY,
    bounds,
    true,
    0,
    0,
    wrapperComponent,
  );

  // `boundLimiter` rounds to two decimals; compare against the same rounding
  // so an in-bounds transform never starts a zero-length animation.
  const isAligned =
    x === roundNumber(state.positionX, 2) &&
    y === roundNumber(state.positionY, 2);
  if (isAligned) return null;

  return { scale: state.scale, positionX: x, positionY: y };
}

const stopResizeTracking = (contextInstance: ReactZoomPanPinchContext) => {
  contextInstance.animation = null;
  contextInstance.animationFrame = null;
  contextInstance.isAnimating = false;
  contextInstance.resizeAnimation = null;
};

/**
 * Eases the transform towards the current bounds, frame by frame, until it
 * rests on them.
 *
 * The bounds are re-read every frame, so a size that keeps changing (a CSS
 * height transition, a layout settling over several frames) is followed
 * smoothly — the content edge trails the moving bound by a few pixels
 * instead of lagging behind a stale target and bursting after it. Each
 * frame closes a fixed fraction of the remaining gap (exponential
 * smoothing), tuned so a one-off step still settles within
 * `autoAlignment.animationTime`.
 */
function startResizeTracking(contextInstance: ReactZoomPanPinchContext): void {
  const { animationTime } = contextInstance.setup.autoAlignment;
  // Over 99% of a step is covered after `animationTime`; the sub-pixel rest
  // snaps (see `isSettled`).
  const tau = Math.max(animationTime / 5, 1);

  handleCancelAnimation(contextInstance);

  let lastFrameTime = Date.now();
  const track = () => {
    if (!contextInstance.mounted || contextInstance.animation !== track) {
      return;
    }
    const now = Date.now();
    const frameTime = Math.max(now - lastFrameTime, 1);
    lastFrameTime = now;

    const targetState = calculateResizeAlignment(contextInstance);
    if (!targetState) {
      // Back inside the bounds (the content grew again).
      stopResizeTracking(contextInstance);
      return;
    }

    const { scale, positionX, positionY } = contextInstance.state;
    const factor = 1 - Math.exp(-frameTime / tau);
    let x = positionX + (targetState.positionX - positionX) * factor;
    let y = positionY + (targetState.positionY - positionY) * factor;

    const isSettled =
      Math.abs(targetState.positionX - x) < 0.5 &&
      Math.abs(targetState.positionY - y) < 0.5;
    if (isSettled) {
      x = targetState.positionX;
      y = targetState.positionY;
    }

    contextInstance.isAnimating = !isSettled;
    contextInstance.setState(scale, x, y);

    if (isSettled) {
      stopResizeTracking(contextInstance);
      return;
    }
    contextInstance.animationFrame = requestAnimationFrame(track);
  };

  contextInstance.animation = track;
  contextInstance.resizeAnimation = track;
  contextInstance.animationResolve = null;
  contextInstance.animationFrame = requestAnimationFrame(track);
}

/**
 * Brings the transform back into the bounds after the content or the
 * wrapper changed size — immediately: a move still in flight (inertia, an
 * alignment, a programmatic animation) is cancelled and a trackpad sequence
 * simply continues against the fresh bounds, so a layout that collapses
 * while the user scrolls aligns right away.
 *
 * Two things are left alone. A pointer that is still held owns the bounds
 * until it is released (replacing them mid-drag makes the next move clamp
 * against a new limit and jump under the cursor); the release then aligns
 * against the fresh bounds (`handleAlignToBounds`). And an animation that is
 * bringing the scale back inside `minScale`/`maxScale` must finish, because
 * the tracking only moves the position. Both come back here afterwards via
 * `flushResizeAlignment`.
 */
export function handleResizeAlignment(
  contextInstance: ReactZoomPanPinchContext,
): void {
  if (contextInstance.setup.disabled) {
    // Nothing may move, but the next gesture must see the right limits.
    handleCalculateBounds(contextInstance, contextInstance.state.scale);
    return;
  }

  if (isPointerGestureActive(contextInstance)) {
    contextInstance.isResizeAlignmentPending = true;
    return;
  }

  const isOwnAnimation =
    contextInstance.animation !== null &&
    contextInstance.animation === contextInstance.resizeAnimation;

  if (contextInstance.animation && !isOwnAnimation) {
    const { scale } = contextInstance.state;
    const { minScale, maxScale } = contextInstance.setup;
    if (scale < minScale || scale > maxScale) {
      contextInstance.isResizeAlignmentPending = true;
      return;
    }
    handleCancelAnimation(contextInstance);
  }

  const targetState = calculateResizeAlignment(contextInstance);

  if (!targetState) {
    if (isOwnAnimation) stopResizeTracking(contextInstance);
    return;
  }

  // The tracking loop re-reads the bounds itself; it just keeps running.
  if (isOwnAnimation) return;

  if (contextInstance.setup.autoAlignment.animationTime === 0) {
    contextInstance.setState(
      targetState.scale,
      targetState.positionX,
      targetState.positionY,
    );
    return;
  }

  startResizeTracking(contextInstance);
}

/**
 * Entry point for the size observer: ignores notifications that carry no
 * size change (the observer's initial delivery, style-only changes) and
 * aligns on the ones that do.
 */
export function handleSizeChange(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { wrapperComponent, contentComponent } = contextInstance;
  if (!wrapperComponent || !contentComponent) return;

  const sizes = measureSizes(wrapperComponent, contentComponent);
  if (!hasSizeChanged(contextInstance.measuredSizes, sizes)) return;

  contextInstance.measuredSizes = sizes;
  handleResizeAlignment(contextInstance);
}
