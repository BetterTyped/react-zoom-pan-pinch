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
  const wrapperWidth = wrapperComponent.clientWidth;
  const wrapperHeight = wrapperComponent.clientHeight;

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
      ? diffWidth * (centerZoomedOut ? 0.5 : 1)
      : 0;
  const scaleHeightFactor =
    wrapperHeight > newContentHeight
      ? diffHeight * (centerZoomedOut ? 0.5 : 1)
      : 0;

  const minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor;
  const maxPositionX = scaleWidthFactor;
  const minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor;
  const maxPositionY = scaleHeightFactor;

  return {
    minPositionX,
    maxPositionX,
    minPositionY,
    maxPositionY,
    scaleWidthFactor,
    scaleHeightFactor,
  };
};

export const calculateBounds = (
  contextInstance: ReactZoomPanPinchContext,
  newScale: number,
): BoundsType => {
  const { wrapperComponent, contentComponent } = contextInstance;
  const { centerZoomedOut, disablePadding } = contextInstance.setup;

  if (!wrapperComponent || !contentComponent) {
    throw new Error("Components are not mounted");
  }

  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newContentHeight,
    newDiffWidth,
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

  const contentFitsCompletely =
    wrapperWidth >= newContentWidth && wrapperHeight >= newContentHeight;
  if (disablePadding && contentFitsCompletely && !centerZoomedOut) {
    bounds.minPositionX = 0;
    bounds.maxPositionX = 0;
    bounds.minPositionY = 0;
    bounds.maxPositionY = 0;
  }

  const {
    minPositionX: propMinX,
    maxPositionX: propMaxX,
    minPositionY: propMinY,
    maxPositionY: propMaxY,
  } = contextInstance.setup;

  // Explicit position props define content-space boundaries at scale=1.
  // Scale them so the same content region stays reachable at every zoom level.
  if (propMinX != null) {
    bounds.minPositionX = wrapperWidth * (1 - newScale) + propMinX * newScale;
  }
  if (propMaxX != null) {
    bounds.maxPositionX = propMaxX * newScale;
  }
  if (propMinY != null) {
    bounds.minPositionY = wrapperHeight * (1 - newScale) + propMinY * newScale;
  }
  if (propMaxY != null) {
    bounds.maxPositionY = propMaxY * newScale;
  }

  return bounds;
};

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

// Based on @aholachek ;)
// https://twitter.com/chpwn/status/285540192096497664
// iOS constant = 0.55

// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5

function rubberband(distance: number, dimension: number, constant: number) {
  if (dimension === 0 || Math.abs(dimension) === Infinity)
    return distance ** (constant * 5);
  return (distance * dimension * constant) / (dimension + constant * distance);
}

export function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  constant = 0.15,
) {
  if (constant === 0) return clamp(position, min, max);
  if (position < min)
    return -rubberband(min - position, max - min, constant) + min;
  if (position > max)
    return +rubberband(position - max, max - min, constant) + max;
  return position;
}

/**
 * Furthest a grabbed position is traced back along the rubber band curve, as
 * a fraction of the padding. The curve never reaches the padding itself, so
 * a position at (or past) it has no pointer distance to map back to.
 */
const MAX_RUBBER_BAND_RATIO = 0.9;

/**
 * Resistance of the rubber band, the constant UIScrollView uses: past a bound
 * the content moves at 0.55× the pointer and slows down from there.
 */
export const RUBBER_BAND_CONSTANT = 0.55;

/**
 * Where a pan that was dragged past a bound ends up: `(1 - 1 / (x * c / d + 1)) * d`
 * with `d` = `padding`. It trails the pointer from the first pixel past the
 * bound and approaches — never reaches — `padding` px past it.
 */
export function getRubberBandPosition(
  position: number,
  min: number,
  max: number,
  padding: number,
): number {
  if (padding <= 0) return clamp(position, min, max);
  if (position < min)
    return min - rubberband(min - position, padding, RUBBER_BAND_CONSTANT);
  if (position > max)
    return max + rubberband(position - max, padding, RUBBER_BAND_CONSTANT);
  return position;
}

/**
 * Inverse of `getRubberBandPosition`: the pointer position that puts the
 * content at `position`. Lets a pan that starts inside the padding (grabbed
 * mid return animation, trackpad deltas) continue from where the content is.
 */
export function getRubberBandSource(
  position: number,
  min: number,
  max: number,
  padding: number,
): number {
  if (padding <= 0) return position;

  const stretch = (offset: number) => {
    const limited = Math.min(offset, padding * MAX_RUBBER_BAND_RATIO);
    return (limited * padding) / (RUBBER_BAND_CONSTANT * (padding - limited));
  };

  if (position < min) return min - stretch(min - position);
  if (position > max) return max + stretch(position - max);
  return position;
}

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

/**
 * Bounded position for a pan gesture: free inside the bounds and, inside the
 * padding around them, rubber banded (`rubberBand`) or 1:1 up to its edge.
 */
export function getPanBoundedPosition(
  positionX: number,
  positionY: number,
  bounds: BoundsType,
  limitToBounds: boolean,
  paddingX: number,
  paddingY: number,
  rubberBand: boolean,
): PositionType {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;

  const limit = (
    position: number,
    min: number,
    max: number,
    padding: number,
  ) => {
    if (limitToBounds && rubberBand && padding > 0) {
      return roundNumber(getRubberBandPosition(position, min, max, padding), 2);
    }
    return boundLimiter(position, min - padding, max + padding, limitToBounds);
  };

  return {
    x: limit(positionX, minPositionX, maxPositionX, paddingX),
    y: limit(positionY, minPositionY, maxPositionY, paddingY),
  };
}
