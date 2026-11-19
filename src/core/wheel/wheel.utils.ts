import { ReactZoomPanPinchContext, PositionType } from "../../models";
import { checkIsNumber, isExcludedNode } from "../../utils";
import { checkZoomBounds } from "../zoom/zoom.utils";

export const isWheelAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { disabled, wheelDisabled, touchPadDisabled, excluded } =
    contextInstance.setup.wheel;
  const { isInitialized } = contextInstance;

  const target = event.target as HTMLElement;
  // Zooming mid-drag is allowed (#543): `handleWheelZoom` re-anchors the pan.
  const isAllowed = isInitialized && !disabled && target;

  if (!isAllowed) return false;
  // A purely horizontal wheel/swipe (Magic Mouse, trackpad) carries no zoom
  // intent. Treating its deltaY of 0 as "zoom out" was #168; leaving it
  // unclaimed also lets trackpad panning pick it up.
  if (event.deltaY === 0) return false;
  // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
  if (wheelDisabled && !event.ctrlKey) return false;
  if (touchPadDisabled && event.ctrlKey) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  const keysPressed = contextInstance.isPressingKeys(
    contextInstance.setup.wheel.activationKeys,
  );

  if (!keysPressed) return false;

  return true;
};

export const isWheelPanningAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { disabled, trackPadPanning } = contextInstance.setup;
  const { activationKeys, excluded } = trackPadPanning;

  if (!contextInstance.wrapperComponent || !contextInstance.contentComponent) {
    return false;
  }

  if (disabled || trackPadPanning.disabled || event.ctrlKey) {
    return false;
  }

  // A drag owns the position; a wheel pan on top of it would be undone by
  // the next pointer move.
  if (contextInstance.isPanning) return false;

  const isAllowed = isWheelAllowed(contextInstance, event);
  // Cannot execute at the same time as wheel zoom
  if (isAllowed) return false;

  const target = event.target as HTMLElement;
  const isExcluded = isExcludedNode(target, excluded);
  if (isExcluded) return false;

  const keysPressed = contextInstance.isPressingKeys(activationKeys);
  if (!keysPressed) return false;

  return true;
};

// px per line for `deltaMode === 1` (Firefox with a mouse wheel), close to
// what browsers scroll a page per line.
const WHEEL_LINE_HEIGHT = 16;

/**
 * The distance in px a wheel event pans by (#500):
 * - line and page deltas (`deltaMode` 1/2) become pixels, so a wheel that
 *   reports "3 lines" moves 48px instead of 3px;
 * - Shift turns a vertical wheel horizontal where the browser does not do it
 *   already (a browser that does reports it as `deltaX`);
 * - `speed` scales the result.
 */
export function getWheelPanDelta(
  event: WheelEvent,
  wrapperComponent: HTMLDivElement,
  speed: number,
): PositionType {
  let unitX = 1;
  let unitY = 1;
  if (event.deltaMode === 1) {
    unitX = WHEEL_LINE_HEIGHT;
    unitY = WHEEL_LINE_HEIGHT;
  } else if (event.deltaMode === 2) {
    unitX = wrapperComponent.clientWidth;
    unitY = wrapperComponent.clientHeight;
  }

  let x = event.deltaX * unitX;
  let y = event.deltaY * unitY;
  if (event.shiftKey && !x) {
    x = y;
    y = 0;
  }

  return { x: x * speed, y: y * speed };
}

export const getDeltaY = (event?: WheelEvent) => {
  if (event) {
    return event.deltaY < 0 ? 1 : -1;
  }
  return 0;
};

export function getDelta(
  event: WheelEvent,
  customDelta?: number | null,
): number {
  const deltaY = getDeltaY(event);
  const delta = checkIsNumber(customDelta, deltaY);
  return delta;
}

export function getMousePosition(
  event: WheelEvent | MouseEvent | TouchEvent,
  contentComponent: HTMLDivElement,
  scale: number,
): PositionType {
  const contentRect = contentComponent.getBoundingClientRect();

  let mouseX = 0;
  let mouseY = 0;

  if ("clientX" in event) {
    // mouse position x, y over wrapper component
    mouseX = (event.clientX - contentRect.left) / scale;
    mouseY = (event.clientY - contentRect.top) / scale;
  } else {
    const touch = event.touches[0];
    mouseX = (touch.clientX - contentRect.left) / scale;
    mouseY = (touch.clientY - contentRect.top) / scale;
  }

  if (Number.isNaN(mouseX) || Number.isNaN(mouseY)) {
    console.error("No mouse or touch offset found");
    return { x: 0, y: 0 };
  }

  return {
    x: mouseX,
    y: mouseY,
  };
}

export const handleCalculateWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  disable: boolean,
  getTarget?: boolean,
): number => {
  const { scale } = contextInstance.state;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation, disablePadding } = setup;
  const { size, disabled } = zoomAnimation;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = scale + delta * step;

  if (getTarget) return targetScale;
  const paddingEnabled = disable ? false : !disabled;
  const newScale = checkZoomBounds(
    targetScale,
    minScale,
    maxScale,
    size,
    paddingEnabled && !disablePadding,
  );
  return newScale;
};

export const handleWheelZoomStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { previousWheelEvent } = contextInstance;
  const { scale } = contextInstance.state;
  const { maxScale, minScale } = contextInstance.setup;

  if (!previousWheelEvent) return false;
  if (scale < maxScale || scale > minScale) return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  if (previousWheelEvent.deltaY > 0 && previousWheelEvent.deltaY < event.deltaY)
    return true;
  if (previousWheelEvent.deltaY < 0 && previousWheelEvent.deltaY > event.deltaY)
    return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  return false;
};
