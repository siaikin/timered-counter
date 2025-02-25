import { StoryObj } from '@storybook/web-components';
import { expect, fn, waitFor } from '@storybook/test';
import { range } from 'remeda';
import { TimeredCounter } from '../../src/index.js';
import { equal as _equal, NoUndefinedField, sleep } from '../utils/index.js';

export async function animationEvents<T, TC extends TimeredCounter>(
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
    equal?: (counter: TimeredCounter, a: any, b: any) => Promise<void>;
  },
) {
  const { step, args } = context;

  setBy(counter, 'value', list[0]);
  await sleep((args.animationOptions.duration ?? 100) + 10);

  const timeredCounterAnimationStartListener = fn();
  const timeredCounterAnimationEndListener = fn();
  counter.addEventListener(
    'timered-counter-animation-start',
    timeredCounterAnimationStartListener,
  );
  counter.addEventListener(
    'timered-counter-animation-end',
    timeredCounterAnimationEndListener,
  );

  await step('Incrementing the value and watching the events', async () => {
    for await (const [index, value] of list.entries()) {
      setBy(counter, 'value', value);

      await waitFor(
        () =>
          expect(timeredCounterAnimationStartListener).toHaveBeenCalledTimes(
            index,
          ),
        { timeout: (args.animationOptions.duration ?? 100) + 1000 },
      );
      await waitFor(
        () =>
          expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(
            index,
          ),
        { timeout: (args.animationOptions.duration ?? 100) + 1000 },
      );

      await equal(counter, counter.value, value);
    }
  });
  timeredCounterAnimationStartListener.mockReset();
  timeredCounterAnimationEndListener.mockReset();

  await step('Decrementing the value and watching the events', async () => {
    for await (const [index, value] of list.slice().reverse().entries()) {
      setBy(counter, 'value', value);

      await waitFor(
        () =>
          expect(timeredCounterAnimationStartListener).toHaveBeenCalledTimes(
            index,
          ),
        { timeout: (args.animationOptions.duration ?? 100) + 1000 },
      );
      await waitFor(
        () =>
          expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(
            index,
          ),
        { timeout: (args.animationOptions.duration ?? 100) + 1000 },
      );

      await equal(counter, counter.value, value);
    }
  });
  timeredCounterAnimationStartListener.mockReset();
  timeredCounterAnimationEndListener.mockReset();

  counter.removeEventListener(
    'timered-counter-animation-start',
    timeredCounterAnimationStartListener,
  );
  counter.removeEventListener(
    'timered-counter-animation-end',
    timeredCounterAnimationEndListener,
  );
}
