import { calculateBoundingArea } from "../utils";
import { checkPositionBounds } from "../zoom/utils";

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
  const { limitToBounds, positionX, positionY, lockAxisX, lockAxisY } = this.stateProvider;

  if (!this.startCoords) return;
  const { x, y } = this.startCoords;

  const positions = getClientPosition(event);
  if (!positions) return console.error("Cannot find mouse client positions");
  const { clientX, clientY } = positions;

  // Get Position
  const newPositionX = lockAxisX ? positionX : clientX - x;
  const newPositionY = lockAxisY ? positionY : clientY - y;

  // If position didn't change
  if (newPositionX === positionX && newPositionY === positionY) return;
  const calculatedPosition = checkPositionBounds(
    newPositionX,
    newPositionY,
    this.bounds,
    limitToBounds
  );

  // Save panned position
  this.stateProvider.positionX = calculatedPosition.x;
  this.stateProvider.positionY = calculatedPosition.y;

  // update component transformation
  this.setContentComponentTransformation();
}
