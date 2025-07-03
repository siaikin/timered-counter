import { FunctionalComponent, h } from 'vue';
import { isNonNullish } from 'remeda';
import type { TimeredCounterString as WCTimeredCounterString } from '../../timered-counter-string.js';
import '../../timered-counter-string.js';
import { formatProps } from './format-props.js';

type ComponentProps = Pick<
  WCTimeredCounterString,
  | 'animationOptions'
  | 'keyframes'
  | 'cellStyles'
  | 'digitStyles'
  | 'partStyles'
  | 'color'
  | 'partsOptions'
  | 'value'
  | 'oldValue'
  | 'initialValue'
  | 'locale'
>;

type Events = {
  'timeredCounterAnimationStart'(): void;
  'timeredCounterAnimationEnd'(): void;
};

type Slots = {
  prefix: () => any;
  suffix: () => any;
};

export const TimeredCounterString: FunctionalComponent<
  ComponentProps,
  Events,
  Partial<Slots>
> = (props, { attrs, slots, emit }) => {
  const { prefix, suffix } = slots;

  return h(
    'timered-counter-string',
    {
      ...attrs,
      ...formatProps(props),
      onTimeredCounterAnimationStart: () =>
        emit('timeredCounterAnimationStart'),
      onTimeredCounterAnimationEnd: () => emit('timeredCounterAnimationEnd'),
    },
    [
      isNonNullish(prefix)
        ? h('slot', { slot: 'prefix' }, prefix())
        : undefined,
      isNonNullish(suffix)
        ? h('slot', { slot: 'suffix' }, suffix())
        : undefined,
    ],
  );
};

TimeredCounterString.props = [
  'animationOptions',
  'keyframes',
  'cellStyles',
  'digitStyles',
  'partStyles',
  'color',
  'partsOptions',
  'value',
  'oldValue',
  'initialValue',
  'locale',
];

TimeredCounterString.emits = [
  'timeredCounterAnimationStart',
  'timeredCounterAnimationEnd',
];
