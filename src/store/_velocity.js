import { checkPositionBounds } from "./_zoom";
import { getClientPosition } from "./_pan";
import { animateFunction, handleDisableAnimation } from "./_animations";

function velocityTimeSpeed(speed, animationTime) {
  const { velocityTimeBasedOnMove } = this.state;

  if (velocityTimeBasedOnMove) {
    return animationTime - animationTime / Math.max(1.6, speed);
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
    limitToBounds,
    velocityAnimationSpeed,
    lockAxisX,
    lockAxisY,
  } = this.state;

  if (!this.velocity || !this.bounds) return handleDisableAnimation.bind(this)();
  const { velocityX, velocityY, velocity } = this.velocity;
  const animationTime = velocityTimeSpeed.bind(this, velocity, velocityAnimationSpeed)();
  const targetX = velocityX;
  const targetY = velocityY;

  this.offsetX = positionX;
  this.offsetY = positionY;

  animateFunction.bind(this, {
    animationTime,
    callback: step => {
      const currentPositionX = lockAxisX ? positionX : this.offsetX + targetX - targetX * step;
      const currentPositionY = lockAxisY ? positionY : this.offsetY + targetY - targetY * step;

      const calculatedPosition = checkPositionBounds(
        currentPositionX,
        currentPositionY,
        this.bounds,
        limitToBounds
      );

      this.offsetX = calculatedPosition.x;
      this.offsetY = calculatedPosition.y;

      // Save panned position
      this.setState({ positionX: calculatedPosition.x, positionY: calculatedPosition.y });
    },
    doneCallback: () => handleDisableAnimation.bind(this)(),
    cancelCallback: () => (this.velocity = null),
  })();
}

export function calculateVelocityStart(event) {
  const { enableVelocity, minVelocityScale, scale, disabled, velocitySensitivity } = this.state;
  if (!enableVelocity || minVelocityScale >= scale || disabled) return;
  handleEnableVelocity.bind(this)();
  const now = Date.now();
  if (this.lastMousePosition) {
    const position = getClientPosition(event);
    if (!position) return console.error("No mouse or touch position detected");
    const { clientX, clientY } = position;
    const distanceX = (clientX - this.lastMousePosition.clientX) * scale;
    const distanceY = (clientY - this.lastMousePosition.clientY) * scale;
    const interval = now - this.velocityTime;
    const velocityX = (distanceX / interval) * velocitySensitivity;
    const velocityY = (distanceY / interval) * velocitySensitivity;
    const velocity =
      (Math.sqrt(distanceX * distanceX + distanceY * distanceY) / interval) * velocitySensitivity;

    if (this.velocity && velocity < this.velocity.velocity && this.throttle) return;
    this.velocity = { velocityX, velocityY, velocity };

    // throttling
    if (this.throttle) clearTimeout(this.throttle);
    this.throttle = setTimeout(() => (this.throttle = false), this.throttleTime);
  }
  const position = getClientPosition(event);
  this.lastMousePosition = position;
  this.velocityTime = now;
}
