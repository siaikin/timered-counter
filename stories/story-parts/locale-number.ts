import { StoryObj } from '@storybook/web-components';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField, sleep } from '../utils/index.js';

export async function localeNumber<TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    setBy,
  }: {
    counter: TC;
    setBy: (counter: TC, key: string, value: string) => void;
  },
) {
  const { step, args } = context;

  const locales = [
    ['en-US', '123,456.789'],
    ['de-DE', '123.456,789'],
    ['zh-CN', '123,456.789'],
    ['ja-JP', '123,456.789'],
    ['ko-KR', '123,456.789'],
    ['fr-FR', '123 456,789'],
  ];

  await step('Testing with different locales', async () => {
    setBy(counter, 'locale-number', 'true');
    setBy(counter, 'value', '123456.789');

    for await (const [locale, expectedValue] of locales) {
      setBy(counter, 'locale', locale);

      await sleep((args.animationOptions.duration ?? 100) + 10);

      await expect(
        counter.getAttribute('aria-label')?.replaceAll(/\s/g, ' '),
      ).toBe(expectedValue);
    }
  });
}
