import {
  Meta,
  setCustomElementsManifest,
  StoryObj,
} from '@storybook/web-components';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import {
  setNumberAdapter,
  type TimeredCounter,
  TimeredCounterNumber,
} from '../../src/index.js';
import { valueChange } from '../story-parts/value-change.js';
import { setByAttr, setByProp } from '../utils/index.js';
import { edgeCase } from '../story-parts/edge-case.js';
import { animationEvents } from '../story-parts/animation-events.js';
import { animationOptions } from '../story-parts/animation-options.js';
import { styles } from '../story-parts/styles.js';
import { localeNumber } from '../story-parts/locale-number.js';

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounterNumber',
  component: 'timered-counter-number',
  tags: ['autodocs', 'timered-counter-number'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export const Basic: StoryObj<TimeredCounterNumber> = {
  args: {
    className: 'test-target',
    // @ts-ignore
    value: '0',
    animationOptions: {
      duration: 100,
    },
  },
  async play(context) {
    const { canvasElement, step } = context;
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    await step('Testing with attribute', async () => {
      await valueChange(context, {
        counter,
        setBy: setByAttr,
      });

      await step('Edge case', async () =>
        edgeCase(context, {
          counter,
          list: [
            ['Setting an empty string', '', '0'],
            ['Setting a non-number', 'a', '0'],
            ['Setting a decimal number', '1.1', '1.1'],
            ['Setting a negative number', '-1', '-1'],
            ['Setting Infinity', 'Infinity', '0'],
            ['Setting NaN', 'NaN', '0'],
            ['Setting null', 'null', '0'],
            ['Setting undefined', 'undefined', '0'],
            ['Setting true', 'true', '0'],
            ['Setting false', 'false', '0'],
            ['Setting an object', '{}', '0'],
            ['Setting an array', '[]', '0'],
            ['Setting a function', '() => {}', '0'],
            ['Setting a Symbol', 'Symbol()', '0'],
            ['Setting a BigInt', 'BigInt(1)', '0'],
          ],
          setBy: setByAttr,
        }),
      );
    });

    await step('Testing with property', async () => {
      await valueChange(context, { counter, setBy: setByProp });

      await step('Edge case', async () =>
        edgeCase(context, {
          counter,
          list: [
            ['Setting an empty string', '', 0],
            ['Setting a non-number', 'a', 0],
            ['Setting a decimal number', '1.1', 1.1],
            ['Setting a negative number', '-1', -1],
            ['Setting Infinity', 'Infinity', 0],
            ['Setting NaN', 'NaN', 0],
            ['Setting null', 'null', 0],
            ['Setting undefined', 'undefined', 0],
            ['Setting true', 'true', 0],
            ['Setting false', 'false', 0],
            ['Setting an object', '{}', 0],
            ['Setting an array', '[]', 0],
            ['Setting a function', '() => {}', 0],
            ['Setting a Symbol', 'Symbol()', 0],
            ['Setting a BigInt', 'BigInt(1)', 0],
          ],
          setBy: setByProp,
        }),
      );
    });
  },
};

export const Events: StoryObj<TimeredCounterNumber> = {
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

    await step('Testing with attribute', async () => {
      await step('Animation events', async () =>
        animationEvents(context, {
          counter,
          setBy: setByAttr,
        }),
      );
    });

    await step('Testing with property', async () => {
      await step('Animation events', async () =>
        animationEvents(context, {
          counter,
          setBy: setByProp,
        }),
      );
    });
  },
};

export const AnimationOptions: StoryObj<TimeredCounterNumber> = {
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

    await step('Testing with attribute', async () => {
      await step('Animation options', async () =>
        animationOptions(context, {
          counter,
          setBy: setByAttr,
        }),
      );
    });

    // await step('Testing with property', async () => {
    //   await step('Animation options', async () =>
    //     animationOptions(context, {
    //       counter,
    //       list,
    //       setBy: setByProp,
    //     }),
    //   );
    // });
  },
};

export const Styles: StoryObj<TimeredCounterNumber> = {
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

    await step('Testing with attribute', async () => {
      await step('Styles', async () =>
        styles(context, {
          counter,
          setBy: setByAttr,
        }),
      );
    });

    await step('Testing with property', async () => {
      await step('Styles', async () =>
        styles(context, {
          counter,
          setBy: setByProp,
        }),
      );
    });
  },
};

export const LocaleNumber: StoryObj<TimeredCounterNumber> = {
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

    await step('Testing with attribute', async () => {
      await step('Locale number', async () =>
        localeNumber(context, {
          counter,
          setBy: setByAttr,
        }),
      );
    });

    await step('Testing with property', async () => {
      await step('Locale number', async () =>
        localeNumber(context, {
          counter,
          setBy: setByProp,
        }),
      );
    });
  },
};
