import { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField } from '../utils/index.js';

export const render = (args: any) =>
  html`<timered-counter
    value=${args.value}
    class=${classMap({ [args.className]: true })}
  >
    <span slot="prefix">prefix</span>
    <span slot="suffix">suffix</span>
    <span slot="part-suffix-0">suffix</span>
  </timered-counter>`;

export async function slots<T, TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
  }: {
    counter: TC;
    list?: T[];
    setBy?: (counter: TC, key: string, value: T) => void;
    equal?: (counter: TimeredCounter, a: any, b: T) => Promise<void>;
  },
) {
  const { step } = context;

  await step('Check slots are rendered', async () => {
    const prefix = counter.shadowRoot
      ?.querySelector('timered-counter-roller')
      ?.shadowRoot?.querySelector('.roller__prefix slot') as HTMLSlotElement;
    const suffix = counter.shadowRoot
      ?.querySelector('timered-counter-roller')
      ?.shadowRoot?.querySelector('.roller__suffix slot') as HTMLSlotElement;

    await expect(
      (prefix?.assignedElements()[0] as HTMLSlotElement)
        .assignedElements()[0]
        .textContent?.trim(),
    ).toBe('prefix');
    await expect(
      (suffix?.assignedElements()[0] as HTMLSlotElement)
        .assignedElements()[0]
        .textContent?.trim(),
    ).toBe('suffix');
  });
}
