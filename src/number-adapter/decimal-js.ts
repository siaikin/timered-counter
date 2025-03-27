import { Decimal } from 'decimal.js';
import { isString } from 'remeda';
import type { NumberAdapter } from './types.js';
import type { TimeredCounterAdapter } from '../timered-counter-adapter.js';

const numberRegex = /^-?\d+(\.\d+)?$/;

const DecimalJsAdapter: (config?: Decimal.Config) => NumberAdapter<Decimal> = (
  config = { precision: 1e3 },
) => {
  const InnerDecimal = Decimal.clone(config);
  return {
    create(value: string | number): Decimal {
      if (isString(value) && !numberRegex.test(value)) value = 0;
      return new InnerDecimal(value);
    },
    add(a, b) {
      return a.plus(b);
    },
    sub(a, b) {
      return a.minus(b);
    },
    mul(a, b) {
      return a.times(b);
    },
    div(a, b) {
      return a.div(b);
    },
    compare(a, b) {
      return a.cmp(b) as 1 | 0 | -1;
    },
    eq(a, b) {
      return a.eq(b);
    },
    gt(a, b) {
      return a.gt(b);
    },
    gte(a, b) {
      return a.gte(b);
    },
    lt(a, b) {
      return a.lt(b);
    },
    lte(a, b) {
      return a.lte(b);
    },
    isInteger(a) {
      return a.isInteger();
    },
    isNegative(a) {
      return a.isNegative();
    },
    isPositive(a) {
      return a.isPositive();
    },
    isZero(a) {
      return a.isZero();
    },
    isNaN(a) {
      return a.isNaN();
    },
    isFinite(a) {
      return a.isFinite();
    },
    abs(a) {
      return a.abs();
    },
    ceil(a) {
      return a.ceil();
    },
    floor(a) {
      return a.floor();
    },
    round(a) {
      return a.round();
    },
    max(a, b) {
      return InnerDecimal.max(a, b);
    },
    min(a, b) {
      return InnerDecimal.min(a, b);
    },
    toNumber(a) {
      return a.toNumber();
    },
    toString(a) {
      return a.toFixed();
    },
  };
};

export function register(
  counterAdapter: typeof TimeredCounterAdapter,
  config?: Decimal.Config,
) {
  counterAdapter.registerNumberAdapter(
    ['decimal.js', 'decimal-js', 'decimaljs'],
    () => DecimalJsAdapter(config),
  );
}

export { DecimalJsAdapter };

export default {
  register,
  DecimalJsAdapter,
};
