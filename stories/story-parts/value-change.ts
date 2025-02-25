import { StoryObj } from '@storybook/web-components';
import { range } from 'remeda';
import { TimeredCounter } from '../../src/index.js';
import { equal as _equal, NoUndefinedField, sleep } from '../utils/index.js';

export async function valueChange<T, TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    list = range(0, 5).map(v => v * 10) as T[],
    setBy,
    equal = _equal,
  }: {
    counter: TC;
    list?: T[];
    setBy: (counter: TC, key: string, value: T) => void;
    equal?: (counter: TimeredCounter, a: any, b: T) => Promise<void>;
  },
) {
  const { step, args } = context;

  await step('Incrementing the value', async () => {
    for await (const value of list) {
      setBy(counter, 'value', value);
      await sleep((args.animationOptions.duration ?? 100) + 10);
      await equal(counter, counter.value, value);
    }
  });

  await step('Decrementing the value', async () => {
    for await (const value of list.slice().reverse()) {
      setBy(counter, 'value', value);
      await sleep((args.animationOptions.duration ?? 100) + 10);
      await equal(counter, counter.value, value);
    }
  });
}
