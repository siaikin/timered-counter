import { StoryObj } from '@storybook/web-components';

import { expect } from '@storybook/test';
import { TimeredCounter } from '../src/index.js';
import { sleep, setByProp, setByAttr } from './utils/index.js';

export const Styles: StoryObj<TimeredCounter> = {
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

    const colorList = [
      'rgb(255, 0, 0)',
      'rgb(0, 255, 0)',
      'rgb(0, 0, 255)',
      'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
      `url("https://picsum.photos/400/300")`,
      `linear-gradient(rgba(255, 0, 0, 0.4), rgba(0, 0, 255, 0.4)), url("https://picsum.photos/400/300")`,
    ];

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      setBy(counter, 'value', '114514');

      await step('Setting the color to different values', async () => {
        for await (const value of colorList) {
          setBy(counter, 'color', value);
          await sleep(110);
          await expect(counter.color).toBe(value);

          const roller = counter.shadowRoot!.querySelector(
            'timered-counter-roller',
          );
          const digits = roller!.shadowRoot!.querySelectorAll(
            'timered-counter-roller-digit',
          );
          const spans = Array.from(digits)
            .map(digit =>
              Array.from(
                digit.shadowRoot!.querySelectorAll('.roll-item > span'),
              ),
            )
            .flat();

          for await (const span of spans) {
            const { style } = span as HTMLSpanElement;
            if (CSS.supports('color', value)) {
              await expect(style.color).toBe(value);
            } else if (CSS.supports('background-image', value)) {
              await expect(style.backgroundImage).toBe(value);
            }
          }
        }
      });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};
