import { StoryObj } from '@storybook/web-components';

import { expect, fn, waitFor } from '@storybook/test';
import { TimeredCounter } from '../src/index.js';
import { setByAttr } from './utils/index.js';
import * as EasingFunctions from '../src/easing/index.js';

export const AnimationOptions: StoryObj<TimeredCounter> = {
  args: {
    value: 0,
    animationOptions: {
      duration: 100,
    },
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      'timered-counter',
    ) as TimeredCounter;

    const timeredCounterAnimationEndListener = fn();
    counter.addEventListener(
      'timered-counter-animation-end',
      timeredCounterAnimationEndListener,
    );

    await step('Delaying each part by 100ms', async () => {
      counter.animationOptionsDynamic = ({ preprocessData }) => {
        let count = 0;
        return preprocessData.map(part =>
          part.map(() => ({ delay: count++ * 100 })),
        );
      };

      setByAttr(counter, 'value', '114514');

      await Promise.resolve();

      await waitFor(
        () =>
          expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(1),
        {
          timeout:
            2000 + counter.partPreprocessDataList.flat().length * 100 * 2,
        },
      );
    });
    timeredCounterAnimationEndListener.mockReset();

    const easingFunctions = [
      ...Object.keys(EasingFunctions),
      /**
       * build-in easing functions
       * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
       */
      // ...[, 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
    ];
    await step('Check easing function', async () => {
      for await (const [index, easing] of Object.entries(easingFunctions)) {
        counter.animationOptionsDynamic = () => ({ easing });

        setByAttr(counter, 'value', Number.parseInt(index, 10).toString());

        await waitFor(
          () =>
            expect(timeredCounterAnimationEndListener).toHaveBeenCalledTimes(1),
          { timeout: 4000 },
        );

        timeredCounterAnimationEndListener.mockReset();
      }
    });
  },
};
