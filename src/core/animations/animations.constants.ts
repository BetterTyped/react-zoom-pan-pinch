/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/**
 * Functions should return denominator of the target value, which is the next animation step.
 * t is a value from 0 to 1, reflecting the percentage of animation status.
 */
const easeOut = (t: number): number => {
  return -Math.cos(t * Math.PI) / 2 + 0.5;
};
// linear
const linear = (t: number): number => {
  return t;
};
// accelerating from zero velocity
const easeInQuad = (t: number): number => {
  return t * t;
};
// decelerating to zero velocity
const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};
// acceleration until halfway, then deceleration
const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
// accelerating from zero velocity
const easeInCubic = (t: number): number => {
  return t * t * t;
};
// decelerating to zero velocity
const easeOutCubic = (t: number): number => {
  return --t * t * t + 1;
};
// acceleration until halfway, then deceleration
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};
// accelerating from zero velocity
const easeInQuart = (t: number): number => {
  return t * t * t * t;
};
// decelerating to zero velocity
const easeOutQuart = (t: number): number => {
  return 1 - --t * t * t * t;
};
// acceleration until halfway, then deceleration
const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};
// accelerating from zero velocity
const easeInQuint = (t: number): number => {
  return t * t * t * t * t;
};
// decelerating to zero velocity
const easeOutQuint = function (t: number): number {
  return 1 + --t * t * t * t * t;
};
// acceleration until halfway, then deceleration
const easeInOutQuint = function (t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};

export const animations = {
  easeOut,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
};
