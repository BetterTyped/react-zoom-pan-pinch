import { ReactZoomPanPinchContext } from "../../models";
import { animate } from "../animations/animations.utils";
import { getMousePosition } from "../wheel/wheel.utils";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import {
  cancelTimeout,
  getContext,
  handleCallback,
  isExcludedNode,
} from "../../utils";
import {
  handleCalculateButtonZoom,
  resetTransformations,
} from "../handlers/handlers.utils";

export function handleDoubleClick(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void {
  const { disabled, mode, step, animationTime, animationType } =
    contextInstance.setup.doubleClick;
  const { onZoomStart, onZoom, onZoomStop } = contextInstance.props;

  if (disabled) return;

  if (mode === "reset") {
    return resetTransformations(contextInstance, animationTime, animationType);
  }

  const { contentComponent } = contextInstance;
  if (!contentComponent) return console.error("No ContentComponent found");

  const delta = mode === "zoomOut" ? -1 : 1;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);

  const { scale } = contextInstance.transformState;
  // stop execution when limit is reached
  if (scale === newScale) return;

  handleCallback(getContext(contextInstance), event, onZoomStart);

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

  handleCallback(getContext(contextInstance), event, onZoom);

  animate(contextInstance, targetState, animationTime, animationType);

  cancelTimeout(contextInstance.doubleClickStopEventTimer);
  contextInstance.doubleClickStopEventTimer = setTimeout(() => {
    contextInstance.doubleClickStopEventTimer = null;
    handleCallback(getContext(contextInstance), event, onZoomStop);
  }, animationTime);
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

  return true;
};
