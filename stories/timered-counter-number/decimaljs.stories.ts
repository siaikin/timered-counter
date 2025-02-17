import { Meta, setCustomElementsManifest } from '@storybook/web-components';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import { Basic } from '../basic.js';
import { Events } from '../events.js';
import { BigNumber } from '../big-number.js';
import { AnimationOptions } from '../animation-options.js';
import { Styles } from '../styles.js';
import { LocaleNumber } from './locale-number.js';
import { setNumberAdapter } from '../../src/index.js';

setCustomElementsManifest(customElementsManifest);

const meta: Meta = {
  title: 'TimeredCounterNumber/with decimal.js',
  component: 'timered-counter-number',
  tags: ['autodocs', 'timered-counter-number'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('decimal.js');
  },
};
export default meta;

export { Basic, Events, BigNumber, AnimationOptions, Styles, LocaleNumber };
