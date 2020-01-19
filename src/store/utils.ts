/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
export const roundNumber = (num, decimal) => {
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
  if (!isActive) return roundNumber(value, 2);
  if (value < minBound) return roundNumber(minBound, 2);
  if (value > maxBound) return roundNumber(maxBound, 2);
  return roundNumber(value, 2);
};

/**
 * Returns relative coords of mouse on wrapper element, and provides
 * info about it's width, height, with same info about its content(zoomed component) element
 */
export const relativeCoords = (
  event,
  wrapperComponent,
  contentComponent,
  panningCase,
) => {
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const contentRect = contentComponent.getBoundingClientRect();
  const contentWidth = contentRect.width;
  const contentHeight = contentRect.height;
  const contentLeft = contentRect.left;
  const contentRight = contentRect.right;
  const diffHeight = wrapperHeight - contentHeight;
  const diffWidth = wrapperWidth - contentWidth;

  // mouse position x, y over wrapper component
  let x = panningCase ? event.clientX : event.clientX - contentRect.left;
  let y = panningCase ? event.clientY : event.clientY - contentRect.top;

  // Mobile touch event case
  if (isNaN(x) && event.touches && event.touches[0]) {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  }

  return {
    x,
    y,
    wrapperWidth,
    wrapperHeight,
    contentWidth,
    contentHeight,
    diffHeight,
    diffWidth,
    contentLeft,
    contentRight,
  };
};

/**
 * Calculate bounding area of zoomed/panned element
 */
export const calculateBoundingArea = (
  wrapperWidth,
  newContentWidth,
  diffWidth,
  wrapperHeight,
  newContentHeight,
  diffHeight,
  limitToWrapper,
) => {
  const scaleWidthFactor =
    wrapperWidth > newContentWidth
      ? diffWidth * (limitToWrapper ? 1 : 0.5)
      : 0;
  const scaleHeightFactor =
    wrapperHeight > newContentHeight
      ? diffHeight * (limitToWrapper ? 1 : 0.5)
      : 0;

  const minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor;
  const maxPositionX = scaleWidthFactor;
  const minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor;
  const maxPositionY = scaleHeightFactor;

  return { minPositionX, maxPositionX, minPositionY, maxPositionY };
};

/**
 * Returns middle coordinates x,y of two points
 * Used to get middle point of two fingers pinch
 */

export const getMiddleCoords = (
  firstPoint,
  secondPoint,
  contentComponent,
  scale,
) => {
  const contentRect = contentComponent.getBoundingClientRect();

  return {
    x:
      ((firstPoint.clientX + secondPoint.clientX) / 2 - contentRect.left) /
      scale,
    y:
      ((firstPoint.clientY + secondPoint.clientY) / 2 - contentRect.top) /
      scale,
  };
};

/**
 * Returns middle position of PageX for touch events
 */
export const getMidPagePosition = (firstPoint, secondPoint) => {
  if (!firstPoint || !secondPoint)
    return console.warn("There are no points provided");
  return {
    x: (firstPoint.clientX + secondPoint.clientX) / 2,
    y: (firstPoint.clientY + secondPoint.clientY) / 2,
  };
};

/**
 * Returns distance between two points x,y
 */
export const getDistance = (firstPoint, secondPoint) => {
  return Math.sqrt(
    Math.pow(firstPoint.pageX - secondPoint.pageX, 2) +
      Math.pow(firstPoint.pageY - secondPoint.pageY, 2),
  );
};

/**
 * Delete undefined values from object keys
 * Used for deleting empty props
 */

export const deleteUndefinedProps = value => {
  let newObject = { ...value };
  Object.keys(newObject).forEach(
    key => newObject[key] === undefined && delete newObject[key],
  );
  return newObject;
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
    true,
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

export const handleWheelStop = (previousEvent, event, stateProvider) => {
  const {
    scale,
    options: { maxScale, minScale },
  } = stateProvider;
  if (!previousEvent) return false;
  if (scale < maxScale || scale > minScale) return true;
  if (Math.sign(previousEvent.deltaY) !== Math.sign(event.deltaY)) return true;
  if (previousEvent.deltaY > 0 && previousEvent.deltaY < event.deltaY)
    return true;
  if (previousEvent.deltaY < 0 && previousEvent.deltaY > event.deltaY)
    return true;
  if (Math.sign(previousEvent.deltaY) !== Math.sign(event.deltaY)) return true;
  return false;
};

export const mergeProps = (initialState, dynamicProps) => {
  return Object.keys(initialState).reduce((acc, curr) => {
    if (typeof dynamicProps[curr] === "object" && dynamicProps[curr] !== null) {
      acc[curr] = { ...initialState[curr], ...dynamicProps[curr] };
    } else {
      acc[curr] =
        dynamicProps[curr] === undefined
          ? initialState[curr]
          : dynamicProps[curr];
    }
    return acc;
  }, {});
};

export function getWindowScaleY(wrapper) {
  if (!wrapper) return 0;
  return window.innerHeight / wrapper.offsetHeight;
}

export function getWindowScaleX(wrapper) {
  if (!wrapper) return 0;
  return window.innerWidth / wrapper.offsetWidth;
}
