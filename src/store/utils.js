/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
export const roundNumber = (num, decimal = 5) => {
  return Number(num.toFixed(decimal));
};

/**
 * Checks if value is number, if not it returns default value
 * 1# eg. checkIsNumber(2, 30) => 2
 * 2# eg. checkIsNumber(null, 30) => 30
 */
export const checkIsNumber = (num, defaultValue) => {
  return typeof num === "number" ? num : defaultValue;
};

/**
 * Keeps value between given bounds, used for limiting view to given boundaries
 * 1# eg. boundLimiter(2, 0, 3, true) => 2
 * 2# eg. boundLimiter(4, 0, 3, true) => 3
 * 3# eg. boundLimiter(-2, 0, 3, true) => 0
 * 4# eg. boundLimiter(10, 0, 3, false) => 10
 */
export const boundLimiter = (value, minBound, maxBound, isActive) => {
  if (!isActive) return value;
  if (value < minBound) return minBound;
  if (value > maxBound) return maxBound;
  return value;
};

/**
 * Returns relative coords of mouse on wrapper element, and provides
 * info about it's width, height, with same info about its content(zoomed component) element
 */
export const relativeCoords = (event, wrapperComponent, contentComponent, panningCase) => {
  // mouse position x, y over wrapper component
  let x = event.offsetX;
  let y = event.offsetY;

  // Panning use mouse position over page because it works even when mouse is outside wrapper
  if (panningCase) {
    x = event.pageX;
    y = event.pageY;
  }

  // sizes
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const contentRect = contentComponent.getBoundingClientRect();
  const contentWidth = contentRect.width;
  const contentHeight = contentRect.height;
  const diffHeight = wrapperHeight - contentHeight;
  const diffWidth = wrapperWidth - contentWidth;

  return {
    x,
    y,
    wrapperWidth,
    wrapperHeight,
    contentWidth,
    contentHeight,
    diffHeight,
    diffWidth,
  };
};

/**
 * Calculate bounding area of zoomed/panned element
 */
export const calculateBoundingArea = (
  wrapperWidth,
  contentWidth,
  diffWidth,
  wrapperHeight,
  contentHeight,
  diffHeight,
  enableZoomedOutPanning
) => {
  const scaleWidthFactor =
    wrapperWidth > contentWidth ? diffWidth * (enableZoomedOutPanning ? 1 : 0.5) : 0;
  const scaleHeightFactor =
    wrapperHeight > contentHeight ? diffHeight * (enableZoomedOutPanning ? 1 : 0.5) : 0;

  const minPositionX = wrapperWidth - contentWidth - scaleWidthFactor;
  const maxPositionX = 0 + scaleWidthFactor;
  const minPositionY = wrapperHeight - contentHeight - scaleHeightFactor;
  const maxPositionY = 0 + scaleHeightFactor;

  return { minPositionX, maxPositionX, minPositionY, maxPositionY };
};

/**
 * Returns middle coordinates x,y of two points
 * Used to get middle point of two fingers pinch
 */

export const getMiddleCoords = (firstPoint, secondPoint) => {
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2,
  };
};

/**
 * Returns distance between two points x,y
 */
export const getDistance = (firstPoint, secondPoint) => {
  return Math.hypot(firstPoint.pageX - secondPoint.pageX, firstPoint.pageY - secondPoint.pageY);
};

/**
 * Delete undefined values from object keys
 * Used for deleting empty props
 */

export const deleteInvalidProps = value => {
  let newObject = { ...value };
  Object.keys(newObject).forEach(key => newObject[key] == undefined && delete newObject[key]);
  return newObject;
};
