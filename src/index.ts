import { Decimal } from 'decimal.js';
import { NumberAdapter } from './number-adapter/index.js';
import { TimeredCounter } from './timered-counter.js';
import { TimeredCounterNumber } from './timered-counter-number.js';
import { TimeredCounterDatetimeDuration } from './timered-counter-datetime-duration.js';
import { StringAdapter } from './string-adapter/index.js';
import { CounterAdapter } from './counter-adapter.js';

export function setNumberAdapter(
  adapterOrType: NumberAdapter | 'number' | 'decimal.js',
  config?: Decimal.Config,
) {
  CounterAdapter.setNumberAdapter(adapterOrType, config);
}

export function setStringAdapter(
  adapterOrType:
    | StringAdapter
    | 'string'
    | 'intl-segmenter'
    | 'grapheme-splitter',
) {
  CounterAdapter.setStringAdapter(adapterOrType);
}

export { TimeredCounter, TimeredCounterDatetimeDuration, TimeredCounterNumber };
