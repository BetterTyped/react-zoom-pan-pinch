/* eslint-disable no-param-reassign */
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

export const handleDoubleClickStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void => {
  const { onZoomStop } = contextInstance.props;
  const { animationTime } = contextInstance.setup.doubleClick;

  cancelTimeout(contextInstance.doubleClickStopEventTimer);
  contextInstance.doubleClickStopEventTimer = setTimeout(() => {
    contextInstance.doubleClickStopEventTimer = null;
    handleCallback(getContext(contextInstance), event, onZoomStop);
  }, animationTime);
};

export const handleDoubleClickResetMode = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
) => {
  const { onZoomStart, onZoom } = contextInstance.props;
  const { animationTime, animationType } = contextInstance.setup.doubleClick;

  handleCallback(getContext(contextInstance), event, onZoomStart);

  resetTransformations(contextInstance, animationTime, animationType, () =>
    handleCallback(getContext(contextInstance), event, onZoom),
  );

  handleDoubleClickStop(contextInstance, event);
};

export function handleDoubleClick(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void {
  const { setup, doubleClickStopEventTimer, transformState, contentComponent } =
    contextInstance;

  const { scale } = transformState;
  const { onZoomStart, onZoom } = contextInstance.props;
  const { disabled, mode, step, animationTime, animationType } =
    setup.doubleClick;

  if (disabled) return;
  if (doubleClickStopEventTimer) return;

  if (mode === "reset") {
    return handleDoubleClickResetMode(contextInstance, event);
  }

  if (!contentComponent) return console.error("No ContentComponent found");

  const delta = mode === "zoomOut" ? -1 : 1;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);

  // stop execution when scale didn't change
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

  handleDoubleClickStop(contextInstance, event);
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
