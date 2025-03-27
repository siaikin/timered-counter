import {
  Meta,
  setCustomElementsManifest,
  StoryObj,
} from '@storybook/web-components';
import { expect } from '@storybook/test';
import { range } from 'remeda';
import { faker } from '@faker-js/faker';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import {
  TimeredCounterAdapter,
  type TimeredCounter,
  TimeredCounterString,
} from '../../src/index.js';
import DecimalJsNumberAdapter from '../../src/number-adapter/decimal-js.js';

import { bigNumber } from '../story-parts/big-number.js';
import { setByAttr, setByProp } from '../utils/index.js';
import { animationEvents } from '../story-parts/animation-events.js';

export { Basic, AnimationOptions, Styles, Emoji } from './index.stories.js';

setCustomElementsManifest(customElementsManifest);

function equal(counter: TimeredCounter, a: any, b: any) {
  a = counter.getAttribute('aria-label')?.replaceAll(/\s/g, ' ');
  return expect(a).toBe(b.toString());
}

const meta: Meta = {
  title: 'TimeredCounterString/with decimal.js',
  component: 'timered-counter-string',
  tags: ['autodocs', 'timered-counter-string'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    TimeredCounterAdapter.registryAdapter(DecimalJsNumberAdapter);
    TimeredCounterAdapter.setNumberAdapter('decimal.js');
  },
};
export default meta;

export const Events: StoryObj<TimeredCounterString> = {
  args: {
    className: 'test-target',
    animationOptions: { duration: 100 },
  },
  async play(context) {
    const { canvasElement, step } = context;
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    const list = range(0, 5).map(() =>
      faker.lorem.sentence({ min: 1, max: 2 }),
    );

    await step('Testing with attribute', () =>
      animationEvents(context, { counter, list, setBy: setByAttr, equal }),
    );

    await step('Testing with property', () =>
      animationEvents(context, { counter, list, setBy: setByProp, equal }),
    );
  },
};

export const BigNumber: StoryObj<TimeredCounterString> = {
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
    ) as TimeredCounter;

    await step('Testing with attribute', async () =>
      bigNumber(context, { counter, setBy: setByAttr, equal }),
    );

    await step('Testing with property', async () =>
      bigNumber(context, { counter, setBy: setByProp, equal }),
    );
  },
};
