/* eslint-disable no-param-reassign */
import { LibrarySetup, ReactZoomPanPinchContext } from "../../models";
import { animate } from "../animations/animations.utils";
import { getMousePosition } from "../wheel/wheel.utils";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import {
  cancelTimeout,
  getContext,
  handleCallback,
  isEditableTarget,
  isExcludedNode,
} from "../../utils";
import {
  getResetScale,
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
    if (!contextInstance.mounted) return;
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

function getDoubleClickScale(mode: LibrarySetup["doubleClick"]["mode"]) {
  return mode === "zoomOut" ? -1 : 1;
}

// Scales closer than this count as "at the reset scale": animations and fits
// land on float values.
const RESET_SCALE_TOLERANCE = 1e-3;

export function handleDoubleClick(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void {
  const { setup, doubleClickStopEventTimer, state, contentComponent } =
    contextInstance;

  const { scale } = state;
  const { onZoomStart, onZoom } = contextInstance.props;
  const { disabled, mode, step, animationTime, animationType } =
    setup.doubleClick;

  if (disabled) return;
  if (doubleClickStopEventTimer) return;

  if (mode === "reset") {
    return handleDoubleClickResetMode(contextInstance, event);
  }

  // `toggle` (#125): at the reset scale (`initialScale`, or the fitted one
  // with `fitOnInit`) zoom in by `step`; anywhere else go back to the reset
  // state. It used to compare against 1, so with another initial scale the
  // first double click zoomed out, and the way back only stepped out.
  if (mode === "toggle") {
    const resetScale = getResetScale(contextInstance);
    if (Math.abs(scale - resetScale) > RESET_SCALE_TOLERANCE) {
      return handleDoubleClickResetMode(contextInstance, event);
    }
  }

  if (!contentComponent) return console.error("No ContentComponent found");

  const delta = getDoubleClickScale(mode);

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

  // Double-clicking a word inside an input selects it; it must not zoom.
  if (isEditableTarget(target)) return false;

  return true;
};
