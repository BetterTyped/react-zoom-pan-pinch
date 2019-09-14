import { checkPositionBounds } from "./_zoom";
import { getClientPosition } from "./_pan";

function velocityTimeSpeed(speed, animationTime) {
  const { velocityBasedOnSpeed } = this.state;

  if (velocityBasedOnSpeed) {
    return animationTime - animationTime / Math.max(1.6, speed);
  }
  return animationTime;
}

function handleEnableVelocity() {
  this.setState({ startAnimation: false });
}

export function handleDisableVelocity() {
  this.velocity = null;
  this.animate = false;
  this.setState({ startAnimation: false });
}

export function handleFireVelocity() {
  this.setState({ startAnimation: true });
}

const easeOut = p => -Math.cos(p * Math.PI) / 2 + 0.5;

export function animateVelocity() {
  this.animate = true;
  const {
    startAnimation,
    positionX,
    positionY,
    limitToBounds,
    velocityAnimationSpeed,
    lockAxisX,
    lockAxisY,
  } = this.state;
  const startTime = new Date().getTime();

  if (!this.velocity || !this.bounds) return handleDisableVelocity.bind(this)();
  const { velocityX, velocityY, velocity } = this.velocity;
  const animationTime = velocityTimeSpeed.bind(this, velocity, velocityAnimationSpeed)();
  const targetX = velocityX;
  const targetY = velocityY;

  this.offsetX = positionX;
  this.offsetY = positionY;

  this.animate = () => {
    if (!startAnimation || !this.animate) {
      this.velocity = null;
      return;
    }

    let frameTime = new Date().getTime() - startTime;
    const time = frameTime / animationTime;
    const step = easeOut(time);
    if (frameTime >= animationTime) {
      handleDisableVelocity.bind(this)();
    } else {
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
      requestAnimationFrame(this.animate);
    }
  };
  requestAnimationFrame(this.animate);
}

export function calculateVelocityStart(event) {
  const { enableVelocity, minVelocityScale, scale, disabled } = this.state;
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
    const velocityX = distanceX / interval;
    const velocityY = distanceY / interval;
    const velocity = Math.sqrt(distanceX * distanceX + distanceY * distanceY) / interval;

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
