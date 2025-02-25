import { StoryObj } from '@storybook/web-components';
import { TimeredCounter } from '../../src/index.js';
import { equal, NoUndefinedField, sleep } from '../utils/index.js';

export async function edgeCase<T, TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    list,
    setBy,
  }: {
    counter: TC;
    list: [label: string, value: T, expectedValue: T][];
    setBy: (counter: TC, key: string, value: T) => void;
  },
) {
  const { step, args } = context;

  for await (const [label, value, expectedValue] of list) {
    await step(label, async () => {
      setBy(counter, 'value', value);
      await sleep((args.animationOptions.duration ?? 100) + 10);
      await equal(counter, counter.value, expectedValue);
    });
  }
}
