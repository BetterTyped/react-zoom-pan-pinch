/**
 * Functions should return denominator of the target value, which is the next animation step.
 * animationProgress is a value from 0 to 1, reflecting the percentage of animation status.
 */
export function easeOut(animationProgress) {
  return -Math.cos(animationProgress * Math.PI) / 2 + 0.5;
}
export function easeIn(animationProgress) {
  return -Math.sin(animationProgress * Math.PI) / 2 + 0.5;
}
export function linear(animationProgress) {
  return animationProgress;
}
