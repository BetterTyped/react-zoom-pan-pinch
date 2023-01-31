import {
  BoundsType,
  PositionType,
  ReactZoomPanPinchContext,
} from "../../models";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";

export function handleCalculateZoomPositions(
  contextInstance: ReactZoomPanPinchContext,
  mouseX: number,
  mouseY: number,
  newScale: number,
  bounds: BoundsType,
  limitToBounds: boolean,
): PositionType {
  const { scale, positionX, positionY } = contextInstance.transformState;

  const scaleDifference = newScale - scale;

  if (typeof mouseX !== "number" || typeof mouseY !== "number") {
    console.error("Mouse X and Y position were not provided!");
    return { x: positionX, y: positionY };
  }

  const calculatedPositionX = positionX - mouseX * scaleDifference;
  const calculatedPositionY = positionY - mouseY * scaleDifference;

  // do not limit to bounds when there is padding animation,
  // it causes animation strange behaviour

  const newPositions = getMouseBoundedPosition(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds,
    0,
    0,
    null,
  );

  return newPositions;
}

export function checkZoomBounds(
  zoom: number,
  minScale: number,
  maxScale: number,
  zoomPadding: number,
  enablePadding: boolean,
): number {
  const scalePadding = enablePadding ? zoomPadding : 0;
  const minScaleWithPadding = minScale - scalePadding;

  if (!Number.isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!Number.isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}
