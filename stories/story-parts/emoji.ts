import { StoryObj } from '@storybook/web-components';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField, sleep } from '../utils/index.js';

export async function emoji<TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    setBy,
    list,
  }: {
    counter: TC;
    list: string[];
    setBy: (counter: TC, key: string, value: string) => void;
    equal?: (counter: TimeredCounter, a: any, b: string) => Promise<void>;
  },
) {
  const { step, args } = context;

  await step('Test difference emoji', async () => {
    for await (const value of list) {
      setBy(counter, 'value', value);

      await sleep((args.animationOptions.duration ?? 100) + 10);

      await expect(
        counter.parts.map(({ digits }) => digits).flat().length,
      ).toBe(counter.stringAdapter.stringToChars(value).length);
    }
  });

  await step('Decrementing the value', async () => {
    for await (const value of list.slice().reverse()) {
      setBy(counter, 'value', value);

      await sleep((args.animationOptions.duration ?? 100) + 10);

      await expect(
        counter.parts.map(({ digits }) => digits).flat().length,
      ).toBe(counter.stringAdapter.stringToChars(value).length);
    }
  });
}
