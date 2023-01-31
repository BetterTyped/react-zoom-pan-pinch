import { ReactZoomPanPinchContext, ReactZoomPanPinchState } from "../../models";
import { roundNumber } from "../../utils";
import { animate } from "../animations/animations.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import { handleAlignToBounds } from "../pan/panning.logic";
import { checkZoomBounds, handleCalculateZoomPositions } from "./zoom.utils";

export function handleZoomToPoint(
  contextInstance: ReactZoomPanPinchContext,
  scale: number,
  mouseX: number,
  mouseY: number,
): Omit<ReactZoomPanPinchState, "previousScale"> | undefined {
  const { minScale, maxScale, limitToBounds } = contextInstance.setup;

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    0,
    false,
  );
  const bounds = handleCalculateBounds(contextInstance, newScale);

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    mouseX,
    mouseY,
    newScale,
    bounds,
    limitToBounds,
  );

  return { scale: newScale, positionX: x, positionY: y };
}

export function handleAlignToScaleBounds(
  contextInstance: ReactZoomPanPinchContext,
  mousePositionX?: number,
  mousePositionY?: number,
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

  const mouseX = mousePositionX || wrapperComponent.offsetWidth / 2;
  const mouseY = mousePositionY || wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint(
    contextInstance,
    minScale,
    mouseX,
    mouseY,
  );

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}
