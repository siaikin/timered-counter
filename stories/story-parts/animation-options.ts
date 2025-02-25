import { StoryObj } from '@storybook/web-components';
import { expect, fn, waitFor } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField } from '../utils/index.js';

export async function animationOptions<T, TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    list = [114514] as T[],
    setBy,
  }: {
    counter: TC;
    list?: T[];
    setBy: (counter: TC, key: string, value: T) => void;
  },
) {
  const { step, args } = context;

  const timeredCounterAnimationEndListener = fn();
  counter.addEventListener(
    'timered-counter-animation-end',
    timeredCounterAnimationEndListener,
  );

  await step('Delaying each part by 100ms', async () => {
    counter.animationOptionsDynamic = ({ preprocessData }) => {
      let count = 0;
      return preprocessData.map(part =>
        part.map(() => ({
          delay: count++ * (args.animationOptions.duration ?? 100),
        })),
      );
    };

    setBy(counter, 'value', list[0]);

    // 等待 parts 更新
    await Promise.resolve();

    await waitFor(
      () => expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(1),
      {
        timeout:
          (counter.parts.map(({ digits }) => digits).flat().length + 1) *
          (args.animationOptions.duration ?? 100),
      },
    );

    counter.animationOptionsDynamic = undefined;
  });
  timeredCounterAnimationEndListener.mockReset();

  counter.removeEventListener(
    'timered-counter-animation-end',
    timeredCounterAnimationEndListener,
  );
}
