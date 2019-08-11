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
  let x = event.offsetX || event.pageX;
  let y = event.offsetY || event.pageY;

  // Panning use mouse position over page because it works even when mouse is outside wrapper
  if (panningCase) {
    x = event.pageX;
    y = event.pageY;
  }

  // Mobile touch event case
  if (isNaN(x)) {
    const dist = getMidPagePosition(event.touches[0], event.touches[1] || event.touches[0]);
    const rect = wrapperComponent.getBoundingClientRect();

    x = dist.x - rect.x;
    y = dist.y - rect.y;
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

export const getMiddleCoords = (firstPoint, secondPoint, wrapperComponent) => {
  if (isNaN(firstPoint.x)) {
    const dist = getMidPagePosition(firstPoint, secondPoint);
    const rect = wrapperComponent.getBoundingClientRect();
    return {
      x: dist.x - rect.x,
      y: dist.y - rect.y,
    };
  }
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2,
  };
};

/**
 * Returns middle position of PageX for touch events
 */
export const getMidPagePosition = (firstPoint, secondPoint) => {
  return {
    x: (firstPoint.clientX + secondPoint.clientX) / 2,
    y: (firstPoint.clientY + secondPoint.clientY) / 2,
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

/**
 * Returns center zoom position, for computations, based on the last mouse position
 */

export const getLastPositionZoomCoords = ({
  lastPositionZoomEnabled,
  lastMouseEventPosition,
  previousScale,
  scale,
  wrapperComponent,
  contentComponent,
  positionX,
  positionY,
  resetLastMousePosition,
}) => {
  if (lastPositionZoomEnabled) {
    if (lastMouseEventPosition) {
      if (
        previousScale === 1 ||
        (previousScale >= 1 && scale <= 1) ||
        (previousScale <= 1 && scale >= 1)
      ) {
        resetLastMousePosition();
        return true;
      }
      return lastMouseEventPosition;
    }
  } else {
    return getRelativeZoomCoords({
      scale,
      wrapperComponent,
      contentComponent,
      positionX,
      positionY,
    });
  }
};

/**
 * Returns center zoom position, for computations, based on the relative center to content node
 */

export const getRelativeZoomCoords = ({
  wrapperComponent,
  contentComponent,
  scale,
  positionX,
  positionY,
}) => {
  const { wrapperWidth, wrapperHeight } = relativeCoords(
    event,
    wrapperComponent,
    contentComponent,
    true
  );
  const x = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const y = (Math.abs(positionY) + wrapperHeight / 2) / scale;
  return { x, y };
};

/**
 * Fire callback if it's function
 */

export const handleCallback = (callback, props) => {
  if (callback && typeof callback === "function") {
    callback(props);
  }
};
