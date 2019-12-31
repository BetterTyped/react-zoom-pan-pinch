import { availableAnimations } from "./utils";

export function handleDisableAnimation() {
  if (!this.mounted) return;
  if (this.animation) {
    cancelAnimationFrame(this.animation);
  }
  this.animate = false;
  this.animation = false;
  this.velocity = false;
}

export function animate(animationName, animationTime, callback) {
  if (!this.mounted) return;
  const startTime = new Date().getTime();
  const lastStep = 1;

  // if another animation is active
  handleDisableAnimation.call(this);

  // new animation
  this.animation = () => {
    if (!this.animation || !this.mounted) return;
    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / animationTime;
    const animationType = availableAnimations[animationName];

    const step = animationType(animationProgress);

    if (frameTime >= animationTime) {
      callback(lastStep);
      this.animation = null;
    } else {
      callback(step);
      requestAnimationFrame(this.animation);
    }
  };

  requestAnimationFrame(this.animation);
}

export function animateComponent({ targetState, speed, type }) {
  const { scale, positionX, positionY } = this.stateProvider;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (speed === 0) {
    this.stateProvider.previousScale = this.stateProvider.scale;
    this.stateProvider.scale = targetState.scale;
    this.stateProvider.positionX = targetState.positionX;
    this.stateProvider.positionY = targetState.positionY;
    this.applyTransformation();
  } else {
    // animation start timestamp
    animate.call(this, type, speed, step => {
      this.stateProvider.previousScale = this.stateProvider.scale;
      this.stateProvider.scale = scale + scaleDiff * step;
      this.stateProvider.positionX = positionX + positionXDiff * step;
      this.stateProvider.positionY = positionY + positionYDiff * step;

      // apply animation changes
      this.applyTransformation();
    });
  }
}
