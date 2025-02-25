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
  setNumberAdapter,
  type TimeredCounter,
  TimeredCounterString,
} from '../../src/index.js';
import { setByAttr, setByProp } from '../utils/index.js';
import { valueChange } from '../story-parts/value-change.js';
import { animationEvents } from '../story-parts/animation-events.js';
import { animationOptions } from '../story-parts/animation-options.js';
import { styles } from '../story-parts/styles.js';
import { emoji } from '../story-parts/emoji.js';

setCustomElementsManifest(customElementsManifest);

//
// function setByAttr(element: TimeredCounter, attr: string, value: string) {
//   element.setAttribute(attr, value);
// }
//
// function setByProp(element: TimeredCounter, prop: string, value: any) {
//   // @ts-ignore
//   element[prop] = value.toString();
// }

function equal(counter: TimeredCounter, a: any, b: any) {
  a = counter.getAttribute('aria-label')?.replaceAll(/\s/g, ' ');
  return expect(a).toBe(b.toString());
}

const meta: Meta = {
  title: 'TimeredCounterString',
  component: 'timered-counter-string',
  tags: ['autodocs', 'timered-counter-string'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export const Basic: StoryObj<TimeredCounterString> = {
  args: {
    className: 'test-target',
    animationOptions: { duration: 100 },
  },
  async play(context) {
    const { canvasElement, step } = context;

    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounterString;

    const list: string[] = [
      'Hello, World!',
      '你好，世界！',
      'こんにちは、世界！',
      '안녕하세요, 세계!',
      // 太长了
      // "Bonjour, le monde!",
      'Hallo, Welt!',
      'Ciao, mondo!',
      'Olá, mundo!',
      'Привет, мир!',
      // '¡Hola, mundo!',
      // 'Hej, världen!',
      // 'Merhaba, Dünya!',
      // 'مرحبا بالعالم!',
      // 'שלום, עולם!',
      // 'नमस्ते, दुनिया!',
      // 'سلام دنیا!',
    ];

    await step('Testing with attribute', async () => {
      await valueChange(context, { counter, list, setBy: setByAttr, equal });
    });

    await step('Testing with property', async () => {
      await valueChange(context, { counter, list, setBy: setByProp, equal });
    });
  },
};

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
      faker.lorem.word({ length: { min: 5, max: 10 } }),
    );

    await step('Testing with attribute', () =>
      animationEvents(context, { counter, list, setBy: setByAttr, equal }),
    );

    await step('Testing with property', () =>
      animationEvents(context, { counter, list, setBy: setByProp, equal }),
    );
  },
};

export const AnimationOptions: StoryObj<TimeredCounterString> = {
  args: {
    className: 'test-target',
    animationOptions: { duration: 100 },
  },
  async play(context) {
    const { canvasElement, step } = context;
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    await step('Testing with attribute', () =>
      animationOptions(context, { counter, setBy: setByAttr }),
    );
  },
};

export const Styles: StoryObj<TimeredCounterString> = {
  args: {
    className: 'test-target',
    animationOptions: { duration: 100 },
  },
  async play(context) {
    const { canvasElement, step } = context;
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    await step('Testing with attribute', () =>
      styles(context, { counter, setBy: setByAttr }),
    );

    await step('Testing with property', () =>
      styles(context, { counter, setBy: setByProp }),
    );
  },
};

export const Emoji: StoryObj<TimeredCounterString> = {
  args: {
    className: 'test-target',
    animationOptions: { duration: 100 },
    // partsOptions: {
    //   fillChar: '1',
    // },
  },
  async play(context) {
    const { canvasElement, step } = context;
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    const list: string[] = ['⌚', '↔️', '👩', '👩🏿', '🧑‍💻'];

    await step('Testing with attribute', () =>
      emoji(context, { counter, list, setBy: setByAttr, equal }),
    );

    await step('Testing with property', () =>
      emoji(context, { counter, list, setBy: setByProp, equal }),
    );
  },
};
