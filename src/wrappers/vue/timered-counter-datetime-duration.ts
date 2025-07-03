import { FunctionalComponent, h } from 'vue';
import { isNonNullish } from 'remeda';
import type { TimeredCounterDatetimeDuration as WCTimeredCounterDatetimeDuration } from '../../timered-counter-datetime-duration.js';
import '../../timered-counter-datetime-duration.js';
import { formatProps } from './format-props.js';

type ComponentProps = Pick<
  WCTimeredCounterDatetimeDuration,
  | 'precision'
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

export const TimeredCounterDatetimeDuration: FunctionalComponent<
  ComponentProps,
  Events,
  Partial<Slots>
> = (props, { attrs, slots, emit }) => {
  const { prefix, suffix } = slots;

  return h(
    'timered-counter-datetime-duration',
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

TimeredCounterDatetimeDuration.props = [
  'precision',
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

TimeredCounterDatetimeDuration.emits = [
  'timeredCounterAnimationStart',
  'timeredCounterAnimationEnd',
];
