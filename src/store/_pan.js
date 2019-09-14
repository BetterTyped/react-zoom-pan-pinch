import { calculateBoundingArea } from "./utils";
import { checkPositionBounds } from "./_zoom";

function getSizes(wrapperComponent, contentComponent) {
  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const contentRect = contentComponent.getBoundingClientRect();

  const wrapperWidth = wrapperRect.width;
  const wrapperHeight = wrapperRect.height;
  const contentWidth = contentRect.width;
  const contentHeight = contentRect.height;
  const diffWidth = wrapperWidth - contentWidth;
  const diffHeight = wrapperHeight - contentHeight;

  return {
    wrapperWidth,
    wrapperHeight,
    contentWidth,
    diffWidth,
    contentHeight,
    diffHeight,
  };
}

function handleCalculateBounds(wrapperComponent, contentComponent, limitToWrapperBounds) {
  const {
    wrapperWidth,
    contentWidth,
    diffWidth,
    wrapperHeight,
    contentHeight,
    diffHeight,
  } = getSizes(wrapperComponent, contentComponent);
  return calculateBoundingArea(
    wrapperWidth,
    contentWidth,
    diffWidth,
    wrapperHeight,
    contentHeight,
    diffHeight,
    limitToWrapperBounds
  );
}

export function getClientPosition(event) {
  const { touches } = event;

  // Mobile points
  if (touches && touches.length === 1) {
    return { clientX: touches[0].clientX, clientY: touches[0].clientY };
  }
  // Desktop points
  if (!touches) {
    return { clientX: event.clientX, clientY: event.clientY };
  }
  return null;
}

export function handlePanning(event) {
  const {
    wrapperComponent,
    contentComponent,
    limitToWrapperBounds,
    limitToBounds,
    positionX,
    positionY,
    scale,
    lockAxisX,
    lockAxisY,
  } = this.state;

  if (!this.startCoords || scale === 1) return;
  const { x, y } = this.startCoords;

  const positions = getClientPosition(event);
  if (!positions) return console.error("Cannot find mouse client positions");
  const { clientX, clientY } = positions;

  // Calculate bounding area
  let bounds = this.bounds;

  // If panning is fired before scaling and there are no bounds calculated
  if (!bounds) {
    const calculatedBounds = handleCalculateBounds(
      wrapperComponent,
      contentComponent,
      limitToWrapperBounds
    );
    this.bounds = calculatedBounds;
    bounds = calculatedBounds;
  }

  // Get Position
  const newPositionX = lockAxisX ? positionX : clientX - x;
  const newPositionY = lockAxisY ? positionY : clientY - y;

  // If position didn't change
  if (newPositionX === positionX && newPositionY === positionY) return;

  const calculatedPosition = checkPositionBounds(newPositionX, newPositionY, bounds, limitToBounds);

  // Save panned position
  this.setState({ positionX: calculatedPosition.x, positionY: calculatedPosition.y });
}
