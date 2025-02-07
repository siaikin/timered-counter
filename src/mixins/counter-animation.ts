import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { isDeepEqual } from 'remeda';
import {
  GroupGetterOptions,
  PartDigitGetter,
  PartDigitValue,
} from '../types/group.js';
import {
  extractPartDigitOption,
  mergePartDigitOption,
} from '../utils/extract-group-option.js';
import { CounterPartsMixin } from './counter-parts.js';
import { AvailableNumberAdapterValueType } from '../number-adapter/index.js';

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
  V extends AvailableNumberAdapterValueType,
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
    @property({ type: Object, attribute: 'animation-options', reflect: true })
    animationOptions: PartDigitValue<KeyframeAnimationOptions> = {};

    animationOptionsDynamic?: PartDigitGetter<KeyframeAnimationOptions>;

    private cachedAnimationOptions: (KeyframeAnimationOptions | undefined)[][] =
      [];

    extractAnimationOptions() {
      const getterOptions: GroupGetterOptions = {
        preprocessData: this.partPreprocessDataList,
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      };
      const result = mergePartDigitOption(
        extractPartDigitOption(this.animationOptions ?? {}, getterOptions),
        extractPartDigitOption(
          this.animationOptionsDynamic ?? {},
          getterOptions,
        ),
      );

      if (!isDeepEqual(this.cachedAnimationOptions, result)) {
        this.cachedAnimationOptions = result;
      }

      return this.cachedAnimationOptions;
    }

    /**
     * 传递给 Web Animations API 的关键帧配置.
     */
    @property({ type: Object, attribute: 'keyframes', reflect: true })
    keyframes: PartDigitValue<PropertyIndexedKeyframes> = {};

    keyframesDynamic?: PartDigitGetter<PropertyIndexedKeyframes>;

    private cachedKeyframes: (PropertyIndexedKeyframes | undefined)[][] = [];

    extractKeyframes() {
      const getterOptions: GroupGetterOptions = {
        preprocessData: this.partPreprocessDataList,
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      };
      const result = mergePartDigitOption(
        extractPartDigitOption(this.keyframes ?? {}, getterOptions),
        extractPartDigitOption(this.keyframesDynamic ?? {}, getterOptions),
      );

      if (!isDeepEqual(this.cachedKeyframes, result)) {
        this.cachedKeyframes = result as (
          | PropertyIndexedKeyframes
          | undefined
        )[][];
      }

      return this.cachedKeyframes;
    }
  }

  return CounterAnimationMixinClass as Constructor<CounterAnimationMixinInterface> &
    T;
};
