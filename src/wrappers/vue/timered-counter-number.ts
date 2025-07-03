import { FunctionalComponent, h, Slot } from 'vue';
import { isNonNullish } from 'remeda';
import type { TimeredCounterNumber as WCTimeredCounterNumber } from '../../timered-counter-number.js';
import '../../timered-counter-number.js';
import { formatProps } from './format-props.js';

type ComponentProps = Pick<
  WCTimeredCounterNumber,
  | 'localeNumber'
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
  prefix: Slot;
  suffix: Slot;
};

export const TimeredCounterNumber: FunctionalComponent<
  ComponentProps,
  Events,
  Partial<Slots>
> = (props, { attrs, slots, emit }) => {
  const { prefix, suffix } = slots;

  return h(
    'timered-counter-number',
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

TimeredCounterNumber.props = [
  'localeNumber',
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

TimeredCounterNumber.emits = [
  'timeredCounterAnimationStart',
  'timeredCounterAnimationEnd',
];
