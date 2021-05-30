import { ReactZoomPanPinchContext } from "../../models";
import { animations } from "../animations/animations.constants";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { getMousePosition } from "../zoom/wheel.utils";
import { animate } from "../animations/animations.utils";
import { createState } from "../../utils/state.utils";
import { checkZoomBounds } from "../zoom/zoom.utils";
import { roundNumber } from "../../utils";

export const handleCalculateButtonZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
): number => {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size } = zoomAnimation;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = scale * Math.exp(delta * step);

  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    false,
  );
  return newScale;
};

export function handleZoomToViewCenter(
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  animationTime: number,
  animationType: keyof typeof animations,
): void {
  const { wrapperComponent } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (!wrapperComponent) return console.error("No WrapperComponent found");

  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (wrapperWidth / 2 - positionX) / scale;
  const mouseY = (wrapperHeight / 2 - positionY) / scale;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);

  const targetState = handleZoomToPoint(
    contextInstance,
    newScale,
    mouseX,
    mouseY,
  );

  if (!targetState) {
    return console.error(
      "Error during zoom event. New transformation state was not calculated.",
    );
  }

  animate(contextInstance, targetState, animationTime, animationType);
}

export function resetTransformations(
  contextInstance: ReactZoomPanPinchContext,
  animationTime: number,
  animationType: keyof typeof animations,
): void {
  const initialTransformation = createState(contextInstance.props);
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (
    scale === initialTransformation.scale &&
    positionX === initialTransformation.positionX &&
    positionY === initialTransformation.positionY
  )
    return;

  animate(contextInstance, initialTransformation, animationTime, animationType);
}

export const isDoubleClickAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { isInitialized, setup } = contextInstance;
  const { disabled } = setup.doubleClick;

  const isAllowed = isInitialized && !disabled;

  if (!isAllowed) return false;

  return true;
};

export function handleDoubleClick(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent,
): void {
  const {
    disabled,
    mode,
    step,
    animationTime,
    animationType,
  } = contextInstance.setup.doubleClick;

  if (disabled) return;

  event.preventDefault();
  event.stopPropagation();

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
