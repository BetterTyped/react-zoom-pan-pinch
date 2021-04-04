export const handleCancelAnimation = () => {
  if (this.animation) cancelAnimationFrame(this.animation);
  if (!this.mounted) return;
  // Clear animation state
  this.animate = false;
  this.animation = false;
  this.velocity = false;
};

export function handleSetupAnimation(
  animationName: string,
  animationTime: number,
  callback: (step: number) => void,
): void {
  if (!this.mounted) return;
  const startTime = new Date().getTime();
  const lastStep = 1;

  // if another animation is active
  handleCancelAnimation.call(this);

  // new animation
  this.animation = () => {
    if (!this.mounted || !this.animation) {
      return cancelAnimationFrame(this.animation);
    }

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

type TargetStateType = {
  targetState: { scale: number; positionX: number; positionY: number };
  animationTime: number;
  animationName: string;
};

export function animate({
  targetState,
  animationTime,
  animationName,
}: TargetStateType): void {
  if (!this.mounted) return;
  const { scale, positionX, positionY } = this.transformState;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (animationTime === 0) {
    this.transformState.previousScale = this.transformState.scale;
    this.transformState.scale = targetState.scale;
    this.transformState.positionX = targetState.positionX;
    this.transformState.positionY = targetState.positionY;
    this.handleStylesUpdate();
  } else {
    // animation start timestamp
    handleSetupAnimation.call(
      this,
      animationName,
      animationTime,
      (step: number) => {
        this.transformState.previousScale = this.transformState.scale;
        this.transformState.scale = scale + scaleDiff * step;
        this.transformState.positionX = positionX + positionXDiff * step;
        this.transformState.positionY = positionY + positionYDiff * step;

        // apply animation changes
        this.handleStylesUpdate();
      },
    );
  }
}
