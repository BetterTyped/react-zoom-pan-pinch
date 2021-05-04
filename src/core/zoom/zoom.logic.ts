import { ReactZoomPanPinchContext, ReactZoomPanPinchState } from "../../models";
import { roundNumber } from "../../utils";
import { animate } from "../animations/animations.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import { handleAlignToBounds } from "../pan/panning.logic";
import { wheelMousePosition } from "./wheel.utils";
import { checkZoomBounds, handleCalculateZoomPositions } from "./zoom.utils";

export function handleAlignToScaleBounds(
  contextInstance: ReactZoomPanPinchContext,
  event?: WheelEvent,
): void {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent } = contextInstance;
  const { minScale, limitToBounds, zoomAnimation } = contextInstance.setup;
  const { disabled, animationTime, animationType } = zoomAnimation;

  const isDisabled = disabled || scale >= minScale;

  if (scale >= 1 || limitToBounds) {
    // fire fit to bounds animation
    handleAlignToBounds(contextInstance);
  }

  if (isDisabled || !wrapperComponent || !contextInstance.mounted) return;

  const mouseX = wrapperComponent.offsetWidth / 2;
  const mouseY = wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint(
    contextInstance,
    false,
    minScale,
    mouseX,
    mouseY,
    event,
  );

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}

export function handleZoomToPoint(
  contextInstance: ReactZoomPanPinchContext,
  isDisabled: boolean,
  scale: number,
  mouseX: number,
  mouseY: number,
  event?: WheelEvent,
): Omit<ReactZoomPanPinchState, "previousScale"> | undefined {
  const { contentComponent } = contextInstance;
  const { disabled, minScale, maxScale, limitToBounds } = contextInstance.setup;

  if (disabled || isDisabled) return;

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    0,
    false,
  );
  const bounds = handleCalculateBounds(contextInstance, newScale);

  let mousePosX = mouseX;
  let mousePosY = mouseY;

  // if event is present - use it's mouse position
  if (event && contentComponent) {
    const mousePosition = wheelMousePosition(event, contentComponent, scale);
    mousePosX = mousePosition.x;
    mousePosY = mousePosition.y;
  }

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    mousePosX,
    mousePosY,
    newScale,
    bounds,
    limitToBounds,
  );

  return { scale: newScale, positionX: x, positionY: y };
}
