import { html } from 'lit';
import {
  Meta,
  StoryObj,
  setCustomElementsManifest,
} from '@storybook/web-components';
import '../src/index.js';
import customElementsManifest from '../custom-elements.json' with { type: 'json' };

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounter',
  component: 'timered-counter',
  tags: ['autodocs'],
  render: () => html`<timered-counter value="0"></timered-counter>`,
};
export default meta;

type Story = StoryObj;

const Simple: Story = {
  args: {
    value: 0,
    keyframes: {},
  },
};

// Simple.parameters = {
//   controls: { include: Object.keys(Simple.args ?? {}) },
// };
export { Simple };

//
// export const CustomHeader = Template.bind({});
// CustomHeader.args = {
//   header: 'My header',
// };
//
// export const CustomCounter = Template.bind({});
// CustomCounter.args = {
//   counter: 123456,
// };
//
// export const SlottedContent = Template.bind({});
// SlottedContent.args = {
//   slot: html`<p>Slotted content</p>`,
// };
// SlottedContent.argTypes = {
//   slot: { table: { disable: true } },
// };
