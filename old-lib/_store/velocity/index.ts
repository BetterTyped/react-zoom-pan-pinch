import { PropsList } from "../interfaces/propsInterface";
import { getClientPosition, handlePanningAnimation } from "../pan";
import { checkPositionBounds } from "../zoom/utils";
import { boundLimiter } from "../utils";
import { animate, handleDisableAnimation } from "../animations";
import { availableAnimations } from "../animations/utils";

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
      panReturnAnimationType,
      padding,
      paddingSize,
    },
    wrapperComponent,
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

  // pan return animation
  const newAnimationTime =
    animationTime > panReturnAnimationTime
      ? animationTime
      : panReturnAnimationTime;

  const paddingValue = padding ? paddingSize : 0;

  const paddingX = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetWidth) / 100
    : 0;
  const paddingY = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetHeight) / 100
    : 0;

  const maxTargetX = maxPositionX + paddingX;
  const minTargetX = minPositionX - paddingX;

  const maxTargetY = maxPositionY + paddingY;
  const minTargetY = minPositionY - paddingY;

  const startPosition = checkPositionBounds(
    positionX,
    positionY,
    this.bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent,
  );

  const startTime = new Date().getTime();

  // animation start timestamp
  animate.call(this, velocityAnimationType, newAnimationTime, step => {
    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / panReturnAnimationTime;
    const returnAnimation = availableAnimations[panReturnAnimationType];

    let customReturnStep = returnAnimation(animationProgress);

    if (
      frameTime > panReturnAnimationTime ||
      customReturnStep > 1 ||
      customReturnStep === Infinity ||
      customReturnStep === -Infinity
    )
      customReturnStep = 1;

    const currentPositionX = getPosition(
      lockAxisX,
      targetX,
      step,
      customReturnStep,
      minPositionX,
      maxPositionX,
      limitToBounds,
      positionX,
      startPosition.x,
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
      positionY,
      startPosition.y,
      minTargetY,
      maxTargetY,
    );

    if (positionX !== currentPositionX || positionY !== currentPositionY) {
      // Save panned position
      this.stateProvider.positionX = currentPositionX;
      this.stateProvider.positionY = currentPositionY;

      // apply animation changes
      this.applyTransformation();
    }
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

    const interval = now - this.velocityTime;

    const wrapperToWindowScaleX =
      2 - wrapperComponent.offsetWidth / window.innerWidth;
    const wrapperToWindowScaleY =
      2 - wrapperComponent.offsetHeight / window.innerHeight;

    const scaledX =
      20 * Math.max(velocityMinSpeed, Math.min(2, wrapperToWindowScaleX));
    const scaledY =
      20 * Math.max(velocityMinSpeed, Math.min(2, wrapperToWindowScaleY));

    const velocityX =
      (distanceX / interval) * velocitySensitivity * scale * scaledX;
    const velocityY =
      (distanceY / interval) * velocitySensitivity * scale * scaledY;

    const speed = distanceX * distanceX + distanceY * distanceY;
    const velocity = (Math.sqrt(speed) / interval) * velocitySensitivity;

    if (this.velocity && velocity < this.velocity.velocity && this.throttle)
      return;
    this.velocity = { velocityX, velocityY, velocity };

    // throttling
    if (this.throttle) clearTimeout(this.throttle);
    this.throttle = setTimeout(() => {
      if (this.mounted) this.throttle = false;
    }, throttleTime);
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
      const newPosition =
        startPosition - (startPosition - maxBound) * panReturnStep;
      if (newPosition > maxTarget) return maxTarget;
      if (newPosition < maxBound) return maxBound;
      return newPosition;
    }
    if (startPosition < minBound && offset < minBound) {
      const newPosition =
        startPosition - (startPosition - minBound) * panReturnStep;
      if (newPosition < minTarget) return minTarget;
      if (newPosition > minBound) return minBound;
      return newPosition;
    }
  }
  if (isLocked) return startPosition;
  const offsetPosition = offset + target * step;
  return boundLimiter(offsetPosition, minBound, maxBound, limitToBounds);
}
