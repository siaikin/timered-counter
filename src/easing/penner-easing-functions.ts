import { cubicBezier } from './cubic-bezier.js';

/**
 * @see https://easings.net
 */

export const easeInSine = cubicBezier(0.12, 0, 0.39, 0);
export const easeOutSine = cubicBezier(0.61, 1, 0.88, 1);
export const easeInOutSine = cubicBezier(0.37, 0, 0.63, 1);

export const easeInQuad = cubicBezier(0.11, 0, 0.5, 0);
export const easeOutQuad = cubicBezier(0.5, 1, 0.89, 1);
export const easeInOutQuad = cubicBezier(0.45, 0, 0.55, 1);

export const easeInCubic = cubicBezier(0.32, 0, 0.67, 0);
export const easeOutCubic = cubicBezier(0.33, 1, 0.68, 1);
export const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

export const easeInQuart = cubicBezier(0.5, 0, 0.75, 0);
export const easeOutQuart = cubicBezier(0.25, 1, 0.5, 1);
export const easeInOutQuart = cubicBezier(0.76, 0, 0.24, 1);

export const easeInQuint = cubicBezier(0.64, 0, 0.78, 0);
export const easeOutQuint = cubicBezier(0.22, 1, 0.36, 1);
export const easeInOutQuint = cubicBezier(0.83, 0, 0.17, 1);

export const easeInExpo = cubicBezier(0.7, 0, 0.84, 0);
export const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);
export const easeInOutExpo = cubicBezier(0.87, 0, 0.13, 1);

export const easeInCirc = cubicBezier(0.55, 0, 1, 0.45);
export const easeOutCirc = cubicBezier(0, 0.55, 0.45, 1);
export const easeInOutCirc = cubicBezier(0.85, 0, 0.15, 1);

export const easeInBack = cubicBezier(0.36, 0, 0.66, -0.56);
export const easeOutBack = cubicBezier(0.34, 1.56, 0.64, 1);
export const easeInOutBack = cubicBezier(0.68, -0.6, 0.32, 1.6);

export function easeInElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  if (x === 0) return 0;
  if (x === 1) return 1;
  return -(2 ** (10 * x - 10)) * Math.sin((x * 10 - 10.75) * c4);
}

export function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  if (x === 0) return 0;
  if (x === 1) return 1;
  return 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export function easeInOutElastic(x: number): number {
  const c5 = (2 * Math.PI) / 4.5;

  if (x === 0) return 0;
  if (x === 1) return 1;
  if (x < 0.5) {
    return (-(2 ** (20 * x - 10)) * Math.sin((20 * x - 11.125) * c5)) / 2;
  }
  return (2 ** (-20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

export function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  }
  if (x < 2 / d1) {
    x -= 1.5 / d1;
    return n1 * x * x + 0.75;
  }
  if (x < 2.5 / d1) {
    x -= 2.25 / d1;
    return n1 * x * x + 0.9375;
  }

  x -= 2.625 / d1;
  return n1 * x * x + 0.984375;
}

export function easeInBounce(x: number): number {
  return 1 - easeOutBounce(1 - x);
}

export function easeInOutBounce(x: number): number {
  if (x < 0.5) {
    return (1 - easeOutBounce(1 - 2 * x)) / 2;
  }
  return (1 + easeOutBounce(2 * x - 1)) / 2;
}
