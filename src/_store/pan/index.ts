import { PropsList } from "../interfaces/propsInterface";
import { checkPositionBounds, handleCalculatePositions } from "../zoom/utils";
import { animateComponent } from "../animations";

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
    scale,
    positionX,
    positionY,
    options: { limitToBounds, minScale },
    pan: { lockAxisX, lockAxisY, padding, paddingSize },
    wrapperComponent,
  } = this.stateProvider;

  if (!this.startCoords) return;
  const { x, y } = this.startCoords;

  const positions = getClientPosition(event);
  if (!positions) return console.error("Cannot find mouse client positions");
  const { clientX, clientY } = positions;

  // Get Position
  const mouseX = clientX - x;
  const mouseY = clientY - y;
  const newPositionX = lockAxisX ? positionX : mouseX;
  const newPositionY = lockAxisY ? positionY : mouseY;

  // padding
  const paddingValue = padding && scale >= minScale ? paddingSize : 0;

  // If position didn't change
  if (newPositionX === positionX && newPositionY === positionY) return;

  const calculatedPosition = checkPositionBounds(
    newPositionX,
    newPositionY,
    this.bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent,
  );

  // Save panned position
  handlePaddingAnimation.call(this, calculatedPosition.x, calculatedPosition.y);
}

export function handlePanningAnimation() {
  const {
    scale,
    options: { minScale },
    pan: { disabled, padding, panReturnAnimationTime, panReturnAnimationType },
  } = this.stateProvider;
  const isDisabled = disabled || scale < minScale || !padding;

  if (isDisabled) return;

  const targetState = handlePanToBounds.call(this);

  animateComponent.call(this, {
    targetState,
    speed: panReturnAnimationTime,
    type: panReturnAnimationType,
  });
}

export function handlePanToBounds() {
  const {
    positionX,
    positionY,
    scale,
    options: { disabled, limitToBounds, limitToWrapper },
  } = this.stateProvider;
  const { wrapperComponent } = this.state;
  if (disabled) return;
  const {
    maxPositionX,
    minPositionX,
    maxPositionY,
    minPositionY,
  } = this.bounds;

  const xChanged = positionX > maxPositionX || positionX < minPositionX;
  const yChanged = positionY > maxPositionY || positionY < minPositionY;

  let mouseX =
    positionX > maxPositionX
      ? wrapperComponent.offsetWidth
      : this.stateProvider.minPositionX || 0;
  let mouseY =
    positionY > maxPositionY
      ? wrapperComponent.offsetHeight
      : this.stateProvider.minPositionY || 0;

  let mousePosX = mouseX;
  let mousePosY = mouseY;

  const { x, y } = handleCalculatePositions.call(
    this,
    mousePosX,
    mousePosY,
    scale,
    this.bounds,
    limitToBounds || limitToWrapper,
  );

  return {
    scale,
    positionX: xChanged ? x : positionX,
    positionY: yChanged ? y : positionY,
  };
}

function handlePaddingAnimation(positionX, positionY) {
  const {
    pan: { padding },
  }: PropsList = this.stateProvider;
  if (!padding) return;
  this.stateProvider.positionX = positionX;
  this.stateProvider.positionY = positionY;
  this.applyTransformation();
}
