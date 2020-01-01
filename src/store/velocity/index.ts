import { PropsList } from "../interfaces/propsInterface";
import { getClientPosition, handlePanningAnimation } from "../pan";
import { boundLimiter } from "../utils";
import { animate, handleDisableAnimation } from "../animations";

const throttleTime = 30;

function velocityTimeSpeed(speed, animationTime) {
  const {
    pan: { velocityEqualToMove },
  }: PropsList = this.stateProvider;

  if (velocityEqualToMove) {
    return animationTime - animationTime / Math.max(1, speed);
  }
  return animationTime;
}

function handleEnableVelocity() {
  this.setState({ startAnimation: false });
}

export function handleFireVelocity() {
  this.setState({ startAnimation: true });
}

export function animateVelocity() {
  const {
    positionX,
    positionY,
    options: { limitToBounds },
    pan: {
      velocityBaseTime,
      lockAxisX,
      lockAxisY,
      velocityAnimationType,
      panReturnAnimationTime,
    },
  } = this.stateProvider;
  if (!this.mounted) return;
  if (!this.velocity || !this.bounds) return handleDisableAnimation.call(this);

  const {
    maxPositionX,
    minPositionX,
    maxPositionY,
    minPositionY,
  } = this.bounds;

  const { velocityX, velocityY, velocity } = this.velocity;
  const animationTime = velocityTimeSpeed.call(
    this,
    velocity,
    velocityBaseTime,
  );

  if (!animationTime) {
    handlePanningAnimation.call(this);
    return;
  }

  const targetX = velocityX;
  const targetY = velocityY;

  this.offsetX = positionX;
  this.offsetY = positionY;

  // pan return animation
  const newAnimationTime =
    animationTime > panReturnAnimationTime
      ? animationTime
      : panReturnAnimationTime;

  const isReturnAnimationLonger = animationTime < panReturnAnimationTime;

  const maxTargetX = positionX - maxPositionX;
  const minTargetX = positionX - minPositionX;

  const maxTargetY = positionY - maxPositionY;
  const minTargetY = positionY - minPositionY;

  // animation start timestamp
  animate.call(this, velocityAnimationType, newAnimationTime, step => {
    let customReturnStep = isReturnAnimationLonger
      ? step
      : step * (newAnimationTime / panReturnAnimationTime);

    if (customReturnStep === Infinity) customReturnStep = 1;

    const currentPositionX = getPosition(
      lockAxisX,
      targetX,
      step,
      customReturnStep,
      minPositionX,
      maxPositionX,
      limitToBounds,
      this.offsetX,
      positionX,
      minTargetX,
      maxTargetX,
    );
    const currentPositionY = getPosition(
      lockAxisY,
      targetY,
      step,
      customReturnStep,
      minPositionY,
      maxPositionY,
      limitToBounds,
      this.offsetY,
      positionY,
      minTargetY,
      maxTargetY,
    );

    this.offsetX = currentPositionX;
    this.offsetY = currentPositionY;

    // Save panned position
    this.stateProvider.positionX = currentPositionX;
    this.stateProvider.positionY = currentPositionY;

    // apply animation changes
    this.applyTransformation();
  });
}

export function calculateVelocityStart(event) {
  const {
    scale,
    options: { disabled },
    pan: {
      velocity,
      velocitySensitivity,
      velocityActiveScale,
      velocityMinSpeed,
    },
    wrapperComponent,
  } = this.stateProvider;

  if (!velocity || velocityActiveScale >= scale || disabled) return;
  handleEnableVelocity.call(this);
  const now = Date.now();
  if (this.lastMousePosition) {
    const position = getClientPosition(event);
    if (!position) return console.error("No mouse or touch position detected");

    const { clientX, clientY } = position;
    const distanceX = clientX - this.lastMousePosition.clientX;
    const distanceY = clientY - this.lastMousePosition.clientY;

    const wrapperToWindowScaleX =
      2 - window.innerWidth / wrapperComponent.offsetWidth;
    const scaleFactorX = Math.max(0.1, Math.min(0.4, wrapperToWindowScaleX));
    const wrapperToWindowScaleY =
      2 - window.innerHeight / wrapperComponent.offsetHeight;
    const scaleFactorY = Math.max(0.1, Math.min(0.4, wrapperToWindowScaleY));

    const scaledDistanceX =
      distanceX -
      distanceX / Math.max(velocityMinSpeed, scale - scale * scaleFactorX);
    const scaledDistanceY =
      distanceY -
      distanceY / Math.max(velocityMinSpeed, scale - scale * scaleFactorY);

    const interval = now - this.velocityTime;

    const velocityX = (scaledDistanceX / interval) * velocitySensitivity;
    const velocityY = (scaledDistanceY / interval) * velocitySensitivity;

    const speed =
      scaledDistanceX * scaledDistanceX + scaledDistanceY * scaledDistanceY;
    const velocity = (Math.sqrt(speed) / interval) * velocitySensitivity;

    if (this.velocity && velocity < this.velocity.velocity && this.throttle)
      return;
    this.velocity = { velocityX, velocityY, velocity };

    // throttling
    if (this.throttle) clearTimeout(this.throttle);
    this.throttle = setTimeout(() => (this.throttle = false), throttleTime);
  }
  const position = getClientPosition(event);
  this.lastMousePosition = position;
  this.velocityTime = now;
}

function getPosition(
  isLocked,
  target,
  step,
  panReturnStep,
  minBound,
  maxBound,
  limitToBounds,
  offset,
  startPosition,
  minTarget,
  maxTarget,
) {
  if (limitToBounds) {
    if (startPosition > minBound && offset > maxBound) {
      const newPosition = startPosition + maxTarget - maxTarget * panReturnStep;
      if (newPosition < maxBound) return maxBound;
      return newPosition;
    }
    if (startPosition < minBound && offset < minBound) {
      const newPosition = startPosition + minTarget - minTarget * panReturnStep;
      if (newPosition > minBound) return minBound;
      return newPosition;
    }
  }
  if (isLocked) return startPosition;
  const offsetPosition = offset + target - target * step;
  return boundLimiter(offsetPosition, minBound, maxBound, limitToBounds);
}
