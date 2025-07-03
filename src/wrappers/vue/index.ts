import type { App, Plugin } from 'vue';
import { TimeredCounterNumber } from './timered-counter-number.js';
import { TimeredCounterDatetimeDuration } from './timered-counter-datetime-duration.js';
import { TimeredCounterString } from './timered-counter-string.js';

const TimeredCounterPlugin: Plugin = {
  install: (app: App) => {
    app.component('TimeredCounterNumber', TimeredCounterNumber);
    app.component(
      'TimeredCounterDatetimeDuration',
      TimeredCounterDatetimeDuration,
    );
    app.component('TimeredCounterString', TimeredCounterString);
  },
};

export {
  TimeredCounterNumber,
  TimeredCounterString,
  TimeredCounterDatetimeDuration,
};

export default TimeredCounterPlugin;

declare module 'vue' {
  interface GlobalComponents {
    TimeredCounterNumber: typeof TimeredCounterNumber;
    TimeredCounterDatetimeDuration: typeof TimeredCounterDatetimeDuration;
    TimeredCounterString: typeof TimeredCounterString;
  }
}
