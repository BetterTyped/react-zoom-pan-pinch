import { PropsList } from "./../interfaces/propsInterface";
import { checkPositionBounds } from "../zoom/utils";

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
    positionX,
    positionY,
    options: { limitToBounds },
    pan: { lockAxisX, lockAxisY },
  }: PropsList = this.stateProvider;

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
    limitToBounds,
  );

  // Save panned position
  this.stateProvider.positionX = calculatedPosition.x;
  this.stateProvider.positionY = calculatedPosition.y;

  // update component transformation
  this.setContentComponentTransformation();
}
