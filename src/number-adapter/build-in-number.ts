import { NumberAdapter } from "./types.js";

const BuildInNumberAdapter: () => NumberAdapter<number> = () => ({
  create(value: string | number): number {
    return Number(value);
  },
  add(a, b) {
    return a + b;
  },
  sub(a, b) {
    return a - b;
  },
  mul(a, b) {
    return a * b;
  },
  div(a, b) {
    return a / b;
  },
  compare(a, b) {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  },
  eq(a, b) {
    return a === b;
  },
  gt(a, b) {
    return a > b;
  },
  gte(a, b) {
    return a >= b;
  },
  lt(a, b) {
    return a < b;
  },
  lte(a, b) {
    return a <= b;
  },
  isInteger(a) {
    return Number.isInteger(a);
  },
  isNegative(a) {
    return a < 0;
  },
  isPositive(a) {
    return a > 0;
  },
  isZero(a) {
    return a === 0;
  },
  isNaN(a) {
    return Number.isNaN(a);
  },
  isFinite(a) {
    return Number.isFinite(a);
  },
  abs(a) {
    return Math.abs(a);
  },
  ceil(a) {
    return Math.ceil(a);
  },
  floor(a) {
    return Math.floor(a);
  },
  round(a) {
    return Math.round(a);
  },
  max(a, b) {
    return Math.max(a, b);
  },
  min(a, b) {
    return Math.min(a, b);
  },
  toNumber(a) {
    return Number(a);
  },
  toString(a) {
    return String(a);
  },
});

export { BuildInNumberAdapter };
