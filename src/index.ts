import { TimeredCounter } from './timered-counter.js';
import { TimeredCounterNumber } from './timered-counter-number.js';
import { TimeredCounterString } from './timered-counter-string.js';
import { TimeredCounterDatetimeDuration } from './timered-counter-datetime-duration.js';

import { TimeredCounterAdapter } from './timered-counter-adapter.js';
import decimalJsAdapter from './number-adapter/decimal-js.js';
import graphemeSplitterAdapter from './string-adapter/grapheme-splitter.js';

export {
  TimeredCounter,
  TimeredCounterDatetimeDuration,
  TimeredCounterNumber,
  TimeredCounterString,
};

export * from './easing/index.js';
export * from './types/index.js';

export * from './timered-counter-adapter.js';

export function registerDecimalJsNumberAdapter() {
  decimalJsAdapter.register(TimeredCounterAdapter);
}

export function registerGraphemeSplitterStringAdapter() {
  graphemeSplitterAdapter.register(TimeredCounterAdapter);
}

declare global {
  interface HTMLElementTagNameMap {
    'timered-counter': TimeredCounter;
    'timered-counter-datetime-duration': TimeredCounterDatetimeDuration;
    'timered-counter-number': TimeredCounterNumber;
    'timered-counter-string': TimeredCounterString;
  }
}
