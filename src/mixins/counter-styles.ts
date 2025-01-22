import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import {
  PartDigitCellGetter,
  PartDigitCellValue,
  PartDigitGetter,
  PartDigitValue,
  PartGetter,
  PartValue,
} from '../types/group.js';
import {
  extractPartDigitCellOption,
  extractPartDigitOption,
  extractPartOption,
} from '../utils/extract-group-option.js';
import { CounterPartsMixin } from './counter-parts.js';

export interface PartDataOptions {
  sampleCount: number;
  digitToChar: Record<string | number, string>;
  decimalSeparator: string;
  minPlaces: [number | undefined, number | undefined];
  fillChar: string;
}

export declare class CounterStylesMixinInterface {
  cellStyles: PartDigitCellValue<Partial<CSSStyleDeclaration>>;

  cellStylesDynamic?: PartDigitCellGetter<Partial<CSSStyleDeclaration>>;

  extractCellStyles(): Partial<CSSStyleDeclaration>[][][];

  digitStyles: PartDigitValue<Partial<CSSStyleDeclaration>>;

  digitStylesDynamic?: PartDigitGetter<Partial<CSSStyleDeclaration>>;

  extractDigitStyles(): Partial<CSSStyleDeclaration>[][];

  partStyles: PartValue<Partial<CSSStyleDeclaration>>;

  partStylesDynamic?: PartGetter<Partial<CSSStyleDeclaration>>;

  extractPartStyles(): Partial<CSSStyleDeclaration>[];

  color: string;
}

export const CounterStylesMixin = <
  V,
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
    @property({ type: Object, attribute: 'cell-styles' })
    cellStyles: PartDigitCellValue<Partial<CSSStyleDeclaration>> = {};

    cellStylesDynamic?: PartDigitCellGetter<Partial<CSSStyleDeclaration>>;

    extractCellStyles() {
      return extractPartDigitCellOption(
        this.cellStylesDynamic ?? this.cellStyles,
        {
          data: this.parts,
          direction: this.direction,
          value: [this.value, this.oldValue],
        },
      );
    }

    /**
     * 与 `cell` 类似, 但是是对 `digit` 部分的样式进行设置.
     * 你还可以使用 `digitStylesDynamic` 来动态设置样式.
     */
    @property({ type: Object, attribute: 'digit-styles' })
    digitStyles: PartDigitValue<Partial<CSSStyleDeclaration>> = {};

    digitStylesDynamic?: PartDigitGetter<Partial<CSSStyleDeclaration>>;

    extractDigitStyles() {
      return extractPartDigitOption(
        this.digitStylesDynamic ?? this.digitStyles,
        {
          data: this.parts,
          direction: this.direction,
          value: [this.value, this.oldValue],
        },
      );
    }

    /**
     * 与 `cell` 类似, 但是是对 `part` 部分的样式进行设置.
     * 你还可以使用 `partStylesDynamic` 来动态设置样式.
     */
    @property({ type: Object, attribute: 'part-styles' })
    partStyles: PartValue<Partial<CSSStyleDeclaration>> = {};

    partStylesDynamic?: PartGetter<Partial<CSSStyleDeclaration>>;

    extractPartStyles() {
      return extractPartOption(this.partStylesDynamic ?? this.partStyles, {
        data: this.parts,
        direction: this.direction,
        value: [this.value, this.oldValue],
      });
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
    @property({ type: String, attribute: 'text-color' })
    color: string = 'inherit';
  }

  return CounterStylesMixinClass as Constructor<CounterStylesMixinInterface> &
    T;
};
