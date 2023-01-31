/* eslint-disable no-param-reassign */
import { roundNumber } from "../../utils";
import {
  BoundsType,
  PositionType,
  ReactZoomPanPinchContext,
} from "../../models";
import { ComponentsSizesType } from "./bounds.types";

export function getComponentsSizes(
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
  newScale: number,
): ComponentsSizesType {
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;

  const contentWidth = contentComponent.offsetWidth;
  const contentHeight = contentComponent.offsetHeight;

  const newContentWidth = contentWidth * newScale;
  const newContentHeight = contentHeight * newScale;
  const newDiffWidth = wrapperWidth - newContentWidth;
  const newDiffHeight = wrapperHeight - newContentHeight;

  return {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  };
}

export const getBounds = (
  wrapperWidth: number,
  newContentWidth: number,
  diffWidth: number,
  wrapperHeight: number,
  newContentHeight: number,
  diffHeight: number,
  centerZoomedOut: boolean,
): BoundsType => {
  const scaleWidthFactor =
    wrapperWidth > newContentWidth
      ? diffWidth * (centerZoomedOut ? 1 : 0.5)
      : 0;
  const scaleHeightFactor =
    wrapperHeight > newContentHeight
      ? diffHeight * (centerZoomedOut ? 1 : 0.5)
      : 0;

  const minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor;
  const maxPositionX = scaleWidthFactor;
  const minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor;
  const maxPositionY = scaleHeightFactor;

  return { minPositionX, maxPositionX, minPositionY, maxPositionY };
};

export const calculateBounds = (
  contextInstance: ReactZoomPanPinchContext,
  newScale: number,
): BoundsType => {
  const { wrapperComponent, contentComponent } = contextInstance;
  const { centerZoomedOut } = contextInstance.setup;

  if (!wrapperComponent || !contentComponent) {
    throw new Error("Components are not mounted");
  }

  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  } = getComponentsSizes(wrapperComponent, contentComponent, newScale);

  const bounds = getBounds(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    Boolean(centerZoomedOut),
  );
  return bounds;
};

/**
 * Keeps value between given bounds, used for limiting view to given boundaries
 * 1# eg. boundLimiter(2, 0, 3, true) => 2
 * 2# eg. boundLimiter(4, 0, 3, true) => 3
 * 3# eg. boundLimiter(-2, 0, 3, true) => 0
 * 4# eg. boundLimiter(10, 0, 3, false) => 10
 */
export const boundLimiter = (
  value: number,
  minBound: number,
  maxBound: number,
  isActive: boolean,
): number => {
  if (!isActive) return roundNumber(value, 2);
  if (value < minBound) return roundNumber(minBound, 2);
  if (value > maxBound) return roundNumber(maxBound, 2);
  return roundNumber(value, 2);
};

export const handleCalculateBounds = (
  contextInstance: ReactZoomPanPinchContext,
  newScale: number,
): BoundsType => {
  const bounds = calculateBounds(contextInstance, newScale);

  // Save bounds
  contextInstance.bounds = bounds;
  return bounds;
};

export function getMouseBoundedPosition(
  positionX: number,
  positionY: number,
  bounds: BoundsType,
  limitToBounds: boolean,
  paddingValueX: number,
  paddingValueY: number,
  wrapperComponent: HTMLDivElement | null,
): PositionType {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;

  let paddingX = 0;
  let paddingY = 0;

  if (wrapperComponent) {
    paddingX = paddingValueX;
    paddingY = paddingValueY;
  }

  const x = boundLimiter(
    positionX,
    minPositionX - paddingX,
    maxPositionX + paddingX,
    limitToBounds,
  );

  const y = boundLimiter(
    positionY,
    minPositionY - paddingY,
    maxPositionY + paddingY,
    limitToBounds,
  );
  return { x, y };
}
