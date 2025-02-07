import { Meta, setCustomElementsManifest } from '@storybook/web-components';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import { Basic } from '../basic.js';
import { Events } from '../events.js';
import { Styles } from '../styles.js';
import { AnimationOptions } from '../animation-options.js';
import { Slots } from '../slots.js';
import { setNumberAdapter } from '../../src/index.js';

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounter',
  component: 'timered-counter',
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export { Basic, Events, Styles, AnimationOptions, Slots };
