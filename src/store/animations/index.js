import { easeIn, easeOut, linear } from "./utils";
import { handleZoomToPoint } from "../zoom";

export function handleDisableAnimation() {
  if (this.animation) {
    cancelAnimationFrame(this.animation);
  }
  this.animation = false;
  this.velocity = null;
}

export function animate(animationName, animationTime, callback) {
  const startTime = new Date().getTime();
  const lastStep = 1;

  // if another animation is active
  handleDisableAnimation.bind(this);

  // new animation
  this.animation = () => {
    if (!this.animation) return;
    const frameTime = new Date().getTime() - startTime;

    const animationProgress = frameTime / animationTime;

    const animationType = {
      easeOut,
      easeIn,
      linear,
    }[animationName];

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

export function handleScalePaddingAnimation(event) {
  const {
    enablePaddingAnimation,
    minScale,
    wrapperComponent,
    scale,
    positionX,
    positionY,
  } = this.stateProvider;

  if (!enablePaddingAnimation || scale > minScale) return;

  let mouseX = wrapperComponent.offsetWidth / 2;
  let mouseY = wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint.bind(this, minScale, mouseX, mouseY, event)();

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  // animation start timestamp
  animate.bind(this, "easeOut", 200, step => {
    this.stateProvider.scale = scale + scaleDiff * step;
    this.stateProvider.positionX = positionX + positionXDiff * step;
    this.stateProvider.positionY = positionY + positionYDiff * step;

    // apply animation changes
    this.setContentComponentTransformation();
  })();
}
