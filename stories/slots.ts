import { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect } from '@storybook/test';
import type { TimeredCounter } from '../src/index.js';

export const Slots: StoryObj<TimeredCounter> = {
  args: {
    value: 0,
  },
  render: args =>
    html`<timered-counter value=${args.value}>
      <span slot="prefix">prefix</span>
      <span slot="suffix">suffix</span>
      <span slot="part-suffix-0">suffix</span>
    </timered-counter>`,
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      'timered-counter',
    ) as TimeredCounter;

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
  },
};
