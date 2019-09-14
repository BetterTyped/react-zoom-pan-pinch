/**
 * Functions should return denominator of the target value, which is the next animation step.
 * animationProgress is a value from 0 to 1, reflecting the percentage of animation status.
 */
function easeOut(animationProgress) {
  return -Math.cos(animationProgress * Math.PI) / 2 + 0.5;
}
function easeIn(animationProgress) {
  return -Math.sin(animationProgress * Math.PI) / 2 + 0.5;
}
function linear(animationProgress) {
  return animationProgress;
}

export function handleDisableAnimation() {
  this.velocity = null;
  this.animate = false;
  this.setState({ startAnimation: false });
}

export function animateFunction({
  animationTime,
  callback,
  cancelCallback,
  doneCallback,
  animationName = "easeOut",
}) {
  this.setState({ startAnimation: true }, () => {
    const { startAnimation } = this.state;
    const lastStep = 1;

    if (this.animate) {
      cancelAnimationFrame(this.animate);
      cancelCallback();
    }
    const startTime = new Date().getTime();

    // if animation has only one step
    if (animationTime === 1) {
      callback(lastStep);
      doneCallback();
      this.animate = null;
      return;
    }
    this.animate = () => {
      if (!startAnimation || !this.animate) return;

      const frameTime = new Date().getTime() - startTime;
      const animationProgress = frameTime / animationTime;
      const animationType = {
        easeOut,
        easeIn,
        linear,
      }[animationName];
      const step = animationType(animationProgress);
      if (frameTime >= animationTime) {
        this.animate = null;
        callback(lastStep);
        doneCallback();
      } else {
        callback(step);
        requestAnimationFrame(this.animate);
      }
    };

    requestAnimationFrame(this.animate);
  });
}
