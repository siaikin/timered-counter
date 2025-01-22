/**
 * 可以使用不同数字类型, 如 int, ~~bigint~~, decimal.js 等
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface NumberAdapter<T = any> {
  create(value: string | number): T;
  add(a: T, b: T): T;
  sub(a: T, b: T): T;
  mul(a: T, b: T | number): T;
  div(a: T, b: T): T;
  compare(a: T, b: T): 1 | 0 | -1;
  eq(a: T, b: T): boolean;
  gt(a: T, b: T): boolean;
  gte(a: T, b: T): boolean;
  lt(a: T, b: T): boolean;
  lte(a: T, b: T): boolean;
  isInteger(a: T): boolean;
  isNegative(a: T): boolean;
  isPositive(a: T): boolean;
  isZero(a: T): boolean;
  isNaN(a: T): boolean;
  isFinite(a: T): boolean;
  abs(a: T): T;
  ceil(a: T): T;
  floor(a: T): T;
  round(a: T): T;
  max(a: T, b: T): T;
  min(a: T, b: T): T;
  toNumber(a: T): number;
  toString(a: T): string;
}

export type ExtractNumberAdapterType<T> =
  T extends NumberAdapter<infer U> ? U : never;
