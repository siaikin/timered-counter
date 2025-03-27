import { TimeredCounter } from './timered-counter.js';
import { TimeredCounterNumber } from './timered-counter-number.js';
import { TimeredCounterString } from './timered-counter-string.js';
import { TimeredCounterDatetimeDuration } from './timered-counter-datetime-duration.js';

export {
  TimeredCounter,
  TimeredCounterDatetimeDuration,
  TimeredCounterNumber,
  TimeredCounterString,
};

export * from './easing/index.js';
export * from './types/index.js';

export * from './timered-counter-adapter.js';

declare global {
  interface HTMLElementTagNameMap {
    'timered-counter': TimeredCounter;
    'timered-counter-datetime-duration': TimeredCounterDatetimeDuration;
    'timered-counter-number': TimeredCounterNumber;
    'timered-counter-string': TimeredCounterString;
  }
}
