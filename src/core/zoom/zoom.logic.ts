import { ReactZoomPanPinchContext, ReactZoomPanPinchState } from "../../models";
import { roundNumber } from "../../utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import {
  checkZoomBounds,
  handleCalculatePositions,
  wheelMousePosition,
} from "./wheel.utils";

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

  const { x, y } = handleCalculatePositions(
    contextInstance,
    mousePosX,
    mousePosY,
    newScale,
    bounds,
    limitToBounds,
  );

  return { scale: newScale, positionX: x, positionY: y };
}
