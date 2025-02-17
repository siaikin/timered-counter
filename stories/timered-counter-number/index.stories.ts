import { Meta, setCustomElementsManifest } from '@storybook/web-components';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import { Basic } from '../basic.js';
import { Events } from '../events.js';
import { Styles } from '../styles.js';
import { AnimationOptions } from '../animation-options.js';
import { LocaleNumber } from './locale-number.js';
import { setNumberAdapter } from '../../src/index.js';

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounterNumber',
  component: 'timered-counter-number',
  tags: ['autodocs', 'timered-counter-number'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export { Basic, Events, AnimationOptions, Styles, LocaleNumber };
