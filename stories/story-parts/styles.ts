import { StoryObj } from '@storybook/web-components';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField, sleep } from '../utils/index.js';

export async function styles<TC extends TimeredCounter>(
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

  setBy(counter, 'value', '114514');

  await step('Test property color with different values', async () => {
    const colorList = [
      'rgb(255, 0, 0)',
      'rgb(0, 255, 0)',
      'rgb(0, 0, 255)',
      'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
      `url("https://picsum.photos/400/300")`,
      `linear-gradient(rgba(255, 0, 0, 0.4), rgba(0, 0, 255, 0.4)), url("https://picsum.photos/400/300")`,
    ];

    for await (const color of colorList) {
      setBy(counter, 'color', color);

      await sleep((args.animationOptions.duration ?? 100) + 10);

      await expect(counter.color).toBe(color);

      const roller = counter.shadowRoot!.querySelector(
        'timered-counter-roller',
      );
      const digits = roller!.shadowRoot!.querySelectorAll(
        'timered-counter-roller-digit',
      );
      const spans = Array.from(digits).map(digit =>
        digit.shadowRoot!.querySelector('.roll-item > span'),
      );

      for await (const span of spans) {
        const { style } = span as HTMLSpanElement;
        if (CSS.supports('color', color)) {
          await expect(style.color).toBe(color);
        } else if (CSS.supports('background-image', color)) {
          await expect(style.backgroundImage).toBe(color);
        }
      }
    }
  });
}
