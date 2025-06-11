import {
  Meta,
  setCustomElementsManifest,
  StoryObj,
} from '@storybook/web-components';
import { isArray, isDate, range } from 'remeda';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addMilliseconds,
  addYears,
  differenceInMilliseconds,
} from 'date-fns';
import { expect } from '@storybook/test';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import {
  DurationPartType,
  setNumberAdapter,
  type TimeredCounter,
  TimeredCounterDatetimeDuration,
} from '../../src/index.js';
import { valueChange } from '../story-parts/value-change.js';
import { datetimePrecision } from '../story-parts/datetime-precision.js';
import { datetimeLocale } from '../story-parts/datetime-locale.js';

setCustomElementsManifest(customElementsManifest);

function setByAttr(
  element: TimeredCounter,
  attr: string,
  value: Date[] | string,
) {
  if (isArray(value)) {
    if (isDate(value[0]) && isDate(value[1])) {
      element.setAttribute(
        attr,
        JSON.stringify((value as Date[]).map(date => date.getTime())),
      );
    }
  } else {
    element.setAttribute(attr, value);
  }
}

function setByProp(element: TimeredCounter, prop: string, value: any) {
  // @ts-ignore
  element[prop] = value;
}

function equal(counter: TimeredCounter, a: any, b: Date[]) {
  const na = counter.numberAdapter;
  return expect(na.toString(a)).toBe(
    na.toString(na.create(differenceInMilliseconds(b[1], b[0]))),
  );
}

const meta: Meta = {
  title: 'TimeredCounterDatetimeDuration',
  component: 'timered-counter-datetime-duration',
  tags: ['autodocs', 'timered-counter-datetime-duration'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export const Basic: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    className: 'test-target',
    animationOptions: {
      duration: 100,
    },
    precision: [DurationPartType.Millisecond, DurationPartType.Day],
  },
  async play(context) {
    const { canvasElement, step } = context;

    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounterDatetimeDuration;

    const date = new Date('2025-06-10T09:43:36Z');
    const list = [
      ...range(0, 2).map(v => [date, addMilliseconds(date, v)]),
      ...range(0, 2).map(v => [date, addSeconds(date, v)]),
      ...range(0, 2).map(v => [date, addMinutes(date, v)]),
      ...range(0, 2).map(v => [date, addHours(date, v)]),
      ...range(0, 2).map(v => [date, addDays(date, v)]),
      ...range(0, 2).map(v => [date, addMonths(date, v)]),
      ...range(0, 2).map(v => [date, addYears(date, v)]),
    ];

    await step('Testing with attribute', async () => {
      await valueChange(context, { counter, list, setBy: setByAttr, equal });
    });

    await step('Testing with property', async () => {
      await valueChange(context, { counter, list, setBy: setByProp, equal });
    });
  },
};

export const Precision: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    className: 'test-target',
    animationOptions: {
      duration: 100,
    },
  },
  async play(context) {
    const { canvasElement, step } = context;

    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounterDatetimeDuration;

    await step('Testing with attribute', async () =>
      datetimePrecision(context, { counter, setBy: setByAttr, equal }),
    );
    await step('Testing with property', async () =>
      datetimePrecision(context, { counter, setBy: setByProp, equal }),
    );
  },
};

export const Locale: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    className: 'test-target',
    animationOptions: {
      duration: 100,
    },
  },
  async play(context) {
    const { canvasElement, step } = context;

    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounterDatetimeDuration;

    await step('Testing with attribute', () =>
      datetimeLocale(context, { counter, setBy: setByAttr, equal }),
    );
    await step('Testing with property', () =>
      datetimeLocale(context, { counter, setBy: setByProp, equal }),
    );
  },
};
