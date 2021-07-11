import { ReactZoomPanPinchContext } from "../../models";

import { animate } from "../animations/animations.utils";
import { getMousePosition } from "core/wheel/wheel.utils";
import { handleZoomToPoint } from "core/zoom/zoom.logic";
import { isExcludedNode } from "utils";
import {
  handleCalculateButtonZoom,
  resetTransformations,
} from "core/handlers/handlers.utils";

export function handleDoubleClick(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void {
  const {
    disabled,
    mode,
    step,
    animationTime,
    animationType,
  } = contextInstance.setup.doubleClick;

  if (disabled) return;

  if (mode === "reset") {
    return resetTransformations(contextInstance, animationTime, animationType);
  }

  const { scale } = contextInstance.transformState;
  const { contentComponent } = contextInstance;

  if (!contentComponent) return console.error("No ContentComponent found");

  const delta = mode === "zoomOut" ? -1 : 1;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);
  const mousePosition = getMousePosition(event, contentComponent, scale);
  const targetState = handleZoomToPoint(
    contextInstance,
    newScale,
    mousePosition.x,
    mousePosition.y,
  );

  if (!targetState) {
    return console.error(
      "Error during zoom event. New transformation state was not calculated.",
    );
  }

  animate(contextInstance, targetState, animationTime, animationType);
}

export const isDoubleClickAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): boolean => {
  const { isInitialized, setup, wrapperComponent } = contextInstance;
  const { disabled, excluded } = setup.doubleClick;

  const target = event.target as HTMLElement;
  const isWrapperChild = wrapperComponent?.contains(target);
  const isAllowed = isInitialized && target && isWrapperChild && !disabled;

  if (!isAllowed) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  if (!isAllowed) return false;

  return true;
};
