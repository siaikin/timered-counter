import {
  Meta,
  setCustomElementsManifest,
  StoryObj,
} from '@storybook/web-components';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import { TimeredCounterAdapter, type TimeredCounter } from '../../src/index.js';
import DecimalJsNumberAdapter from '../../src/number-adapter/decimal-js.js';
import { bigNumber } from '../story-parts/big-number.js';
import { setByAttr, setByProp } from '../utils/index.js';

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounter/with decimal.js',
  component: 'timered-counter',
  tags: ['autodocs', 'timered-counter'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    TimeredCounterAdapter.registryAdapter(DecimalJsNumberAdapter);
    TimeredCounterAdapter.setNumberAdapter('decimal.js');
  },
};
export default meta;

export {
  Basic,
  Events,
  AnimationOptions,
  Slots,
  Styles,
} from './index.stories.js';

export const BigNumber: StoryObj<TimeredCounter> = {
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
      bigNumber(context, { counter, setBy: setByAttr }),
    );

    await step('Testing with property', async () =>
      bigNumber(context, { counter, setBy: setByProp }),
    );
  },
};
