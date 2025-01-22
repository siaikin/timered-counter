import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { PartDigitGetter, PartDigitValue } from '../types/group.js';
import { extractPartDigitOption } from '../utils/extract-group-option.js';
import { CounterPartsMixin } from './counter-parts.js';

export interface PartDataOptions {
  sampleCount: number;
  digitToChar: Record<string | number, string>;
  decimalSeparator: string;
  minPlaces: [number | undefined, number | undefined];
  fillChar: string;
}

export declare class CounterAnimationMixinInterface {
  animationOptions: PartDigitValue<KeyframeAnimationOptions>;

  animationOptionsDynamic?: PartDigitGetter<KeyframeAnimationOptions>;

  extractAnimationOptions(): KeyframeAnimationOptions[][];

  keyframes: PartDigitValue<PropertyIndexedKeyframes>;

  keyframesDynamic?: PartDigitGetter<PropertyIndexedKeyframes>;

  extractKeyframes(): PropertyIndexedKeyframes[][];
}

export const CounterAnimationMixin = <
  V,
  T extends ReturnType<typeof CounterPartsMixin<V>> = ReturnType<
    typeof CounterPartsMixin<V>
  >,
>(
  superClass: T,
) => {
  class CounterAnimationMixinClass extends superClass {
    /**
     * 传递给 Web Animations API 的选项.
     */
    @property({ type: Object, attribute: 'animation-options' })
    animationOptions: PartDigitValue<KeyframeAnimationOptions> = {};

    animationOptionsDynamic?: PartDigitGetter<KeyframeAnimationOptions>;

    extractAnimationOptions() {
      return extractPartDigitOption(
        this.animationOptionsDynamic ?? this.animationOptions,
        {
          data: this.parts,
          direction: this.direction,
          value: [this.value, this.oldValue],
        },
      );
    }

    /**
     * 传递给 Web Animations API 的关键帧配置.
     */
    @property({ type: Object, attribute: 'keyframes' })
    keyframes: PartDigitValue<PropertyIndexedKeyframes> = {};

    keyframesDynamic?: PartDigitGetter<PropertyIndexedKeyframes>;

    extractKeyframes() {
      return extractPartDigitOption(this.keyframesDynamic ?? this.keyframes, {
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      });
    }
  }

  return CounterAnimationMixinClass as Constructor<CounterAnimationMixinInterface> &
    T;
};
