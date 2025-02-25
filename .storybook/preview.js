import { html } from 'lit';
import './styles.css';

const preview = {
  // argTypes: {
  //   value: { control: { type: 'number' } },
  //   keyframes: { control: { type: 'object' } },
  //   locale: { control: { type: 'text' } },
  //   animationOptions: { control: { type: 'object' } },
  //   'animation-options': { control: { type: 'object' } },
  // },
  // globalTypes: {
  //   duration: {
  //     description: 'The duration of the animation',
  //     toolbar: {
  //       title: 'Duration',
  //       icon: 'timer',
  //       items: ['100', '1000', '5000'],
  //       dynamicTitle: true,
  //     },
  //   },
  // },
  // initialGlobals: {
  //   duration: 100,
  // },

  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
    controls: {},
  },

  decorators: [
    story =>
      html`<div
        style="font-family: monospace;display: flex; justify-content: center; padding: 8px; font-size: 32px"
      >
        ${story()}
      </div>`,
  ],
};

export default preview;
