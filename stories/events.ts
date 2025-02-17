import { StoryObj } from '@storybook/web-components';
import { range } from 'remeda';
import { expect, fn, waitFor } from '@storybook/test';
import type { TimeredCounter } from '../src/index.js';
import { equal, setByProp, setByAttr } from './utils/index.js';

export const Events: StoryObj<TimeredCounter> = {
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

    const list = range(0, 5);

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      await step('Incrementing the value', async () => {
        for await (const [index, value] of list.entries()) {
          setBy(counter, 'value', value.toString());

          await waitFor(() =>
            expect(timeredCounterAnimationStartListener).toHaveBeenCalledTimes(
              index,
            ),
          );
          await waitFor(() =>
            expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(
              index,
            ),
          );
          await equal(counter, counter.value, value);
        }
      });
      timeredCounterAnimationStartListener.mockReset();
      timeredCounterAnimationEndListener.mockReset();

      await step('Decrementing the value', async () => {
        for await (const [index, value] of list.slice().reverse().entries()) {
          setBy(counter, 'value', value.toString());

          await waitFor(() =>
            expect(timeredCounterAnimationStartListener).toHaveBeenCalledTimes(
              index,
            ),
          );
          await waitFor(() =>
            expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(
              index,
            ),
          );
          await equal(counter, counter.value, value);
        }
      });
      timeredCounterAnimationStartListener.mockReset();
      timeredCounterAnimationEndListener.mockReset();
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));

    counter.removeEventListener(
      'timered-counter-animation-start',
      timeredCounterAnimationStartListener,
    );
    counter.removeEventListener(
      'timered-counter-animation-end',
      timeredCounterAnimationEndListener,
    );
  },
};
