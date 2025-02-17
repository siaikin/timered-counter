import { StoryObj } from '@storybook/web-components';
import { expect } from '@storybook/test';
import { TimeredCounter, TimeredCounterNumber } from '../../src/index.js';
import { sleep, setByProp, setByAttr } from '../utils/index.js';

export const LocaleNumber: StoryObj<TimeredCounterNumber> = {
  args: {
    className: 'test-target',
    value: 0,
    animationOptions: {
      duration: 100,
    },
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    const locales = [
      ['en-US', '123,456.789'],
      ['de-DE', '123.456,789'],
      ['zh-CN', '123,456.789'],
      ['ja-JP', '123,456.789'],
      ['ko-KR', '123,456.789'],
      ['fr-FR', '123 456,789'],
    ];
    // const locales = ['en-US', 'de-DE', 'zh-CN'];

    // const list = ['114514', '1919810', '810893', '893810'];
    // const list = ['123456.789'];

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      await step('Incrementing the value', async () => {
        setBy(counter, 'locale-number', 'true');
        setBy(counter, 'value', '123456.789');

        for await (const [locale, expectedValue] of locales) {
          setBy(counter, 'locale', locale);
          await sleep(110);

          await expect(
            counter.getAttribute('aria-label')?.replaceAll(/\s/g, ' '),
          ).toBe(expectedValue);
        }
      });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};
