import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { isDeepEqual } from 'remeda';
import {
  GroupGetterOptions,
  PartDigitCellGetter,
  PartDigitCellValueOrGetter,
  PartDigitGetter,
  PartDigitValueOrGetter,
  PartGetter,
  PartValueOrGetter,
} from '../types/group.js';
import {
  extractPartDigitCellOption,
  extractPartDigitOption,
  extractPartOption,
  mergePartDigitCellOption,
  mergePartDigitOption,
  mergePartOption,
} from '../utils/extract-group-option.js';
import { CounterPartsMixin } from './counter-parts.js';
import { AvailableNumberAdapterValueType } from '../number-adapter/index.js';

export declare class CounterStylesMixinInterface {
  cellStyles: PartDigitCellValueOrGetter<Partial<CSSStyleDeclaration>>;

  cellStylesDynamic?: PartDigitCellGetter<Partial<CSSStyleDeclaration>>;

  extractCellStyles(): Partial<CSSStyleDeclaration>[][][];

  digitStyles: PartDigitValueOrGetter<Partial<CSSStyleDeclaration>>;

  digitStylesDynamic?: PartDigitGetter<Partial<CSSStyleDeclaration>>;

  extractDigitStyles(): Partial<CSSStyleDeclaration>[][];

  partStyles: PartValueOrGetter<Partial<CSSStyleDeclaration>>;

  partStylesDynamic?: PartGetter<Partial<CSSStyleDeclaration>>;

  extractPartStyles(): Partial<CSSStyleDeclaration>[];

  color: string;
}

export const CounterStylesMixin = <
  V extends AvailableNumberAdapterValueType,
  T extends ReturnType<typeof CounterPartsMixin<V>> = ReturnType<
    typeof CounterPartsMixin<V>
  >,
>(
  superClass: T,
) => {
  class CounterStylesMixinClass extends superClass {
    /**
     * 对 `cell` 部分的样式进行设置. 传入的对象将被直接应用到 `cell` 的 `style` 上.
     * 你还可以使用 `cellStylesDynamic` 来动态设置样式.
     */
    @property({ type: Object, attribute: 'cell-styles', reflect: true })
    cellStyles: PartDigitCellValueOrGetter<Partial<CSSStyleDeclaration>> = {};

    cellStylesDynamic?: PartDigitCellGetter<Partial<CSSStyleDeclaration>>;

    private cachedCellStyles: Partial<CSSStyleDeclaration | undefined>[][][] =
      [];

    extractCellStyles() {
      const getterOptions: GroupGetterOptions = {
        preprocessData: this.partPreprocessDataList,
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      };
      const result = mergePartDigitCellOption(
        extractPartDigitCellOption(this.cellStyles ?? {}, getterOptions),
        extractPartDigitCellOption(this.cellStylesDynamic ?? {}, getterOptions),
      );

      if (!isDeepEqual(this.cachedCellStyles, result)) {
        this.cachedCellStyles = result;
      }

      return this.cachedCellStyles;
    }

    /**
     * 与 `cell` 类似, 但是是对 `digit` 部分的样式进行设置.
     * 你还可以使用 `digitStylesDynamic` 来动态设置样式.
     */
    @property({ type: Object, attribute: 'digit-styles', reflect: true })
    digitStyles: PartDigitValueOrGetter<Partial<CSSStyleDeclaration>> = {};

    digitStylesDynamic?: PartDigitGetter<Partial<CSSStyleDeclaration>>;

    private cachedDigitStyles: Partial<CSSStyleDeclaration | undefined>[][] =
      [];

    extractDigitStyles() {
      const getterOptions: GroupGetterOptions = {
        preprocessData: this.partPreprocessDataList,
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      };
      const result = mergePartDigitOption(
        extractPartDigitOption(this.digitStyles ?? {}, getterOptions),
        extractPartDigitOption(this.digitStylesDynamic ?? {}, getterOptions),
      );

      if (!isDeepEqual(this.cachedDigitStyles, result)) {
        this.cachedDigitStyles = result;
      }

      return this.cachedDigitStyles;
    }

    /**
     * 与 `cell` 类似, 但是是对 `part` 部分的样式进行设置.
     * 你还可以使用 `partStylesDynamic` 来动态设置样式.
     */
    @property({ type: Object, attribute: 'part-styles', reflect: true })
    partStyles: PartValueOrGetter<Partial<CSSStyleDeclaration>> = {};

    partStylesDynamic?: PartGetter<Partial<CSSStyleDeclaration>>;

    private cachedPartStyles: Partial<CSSStyleDeclaration | undefined>[] = [];

    extractPartStyles() {
      const getterOptions: GroupGetterOptions = {
        preprocessData: this.partPreprocessDataList,
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      };
      const result = mergePartOption(
        extractPartOption(this.partStyles ?? {}, getterOptions),
        extractPartOption(this.partStylesDynamic ?? {}, getterOptions),
      );

      if (!isDeepEqual(this.cachedPartStyles, result)) {
        this.cachedPartStyles = result;
      }

      return this.cachedPartStyles;
    }

    /**
     * 文本颜色, 可使用 CSS 属性 `color` 和 `background-image` 的值.
     *
     * @default 继承自父元素.
     *
     * @example "red" 红色
     * @example "transparent" 透明
     * @example "linear-gradient(90deg, red, blue)" 红蓝渐变
     * @example "url('https://example.com/image.png')" 图片背景
     */
    @property({ type: String, reflect: true })
    color: string = 'inherit';
  }

  return CounterStylesMixinClass as Constructor<CounterStylesMixinInterface> &
    T;
};
