import { PropertyValues } from 'lit';
import { zip } from 'd3-array';
import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { isArray, isObjectType } from 'remeda';
import { CounterBaseMixin } from './counter-base.js';
import { PartData } from '../types/group.js';
import { transitionDigit } from '../utils/transition-digit.js';
import {
  PartPreprocessedData,
  preprocessPartData,
} from '../utils/preprocess-part-data.js';
import { AvailableNumberAdapterValueType } from '../number-adapter/index.js';
import { parseJsonString } from '../utils/parse-json-string.js';

export interface PartsOptions {
  sampleCount: number;
  /**
   * 可以通过该属性将数字转换为你想要的任意字符串.
   */
  digitToChar: Record<string | number, string> | string[];
  decimalSeparator: string;
  /**
   * 当**位数不足**时, 强制补全的 [整数, 小数] 位数. 为空时位数自适应.
   */
  minPlaces: [number | undefined, number | undefined];
  fillChar: string;
}
type InnerPartsOptions = Omit<PartsOptions, 'digitToChar'> & {
  digitToChar: Record<string | number, string>;
};

export declare class CounterPartsMixinInterface<
  V extends AvailableNumberAdapterValueType,
> {
  parts: PartData[];

  oldParts: PartData[];

  partPreprocessDataList: PartPreprocessedData[][];

  partsOptions: PartsOptions;

  sampling(from: V, to: V): V[];

  sampleSplit(samples: V[]): V[][];

  sampleToString(value: V): string;
}

function toChar(value: number) {
  return String.fromCodePoint(value + 48);
}

function preprocessPartsOptions(options: PartsOptions): InnerPartsOptions {
  const digitToChar: Record<string, string> = {};

  if (isArray(options.digitToChar)) {
    options.digitToChar.forEach((char, index) => {
      digitToChar[toChar(index)] = char;
    });
  } else if (isObjectType(options.digitToChar)) {
    Object.entries(options.digitToChar).forEach(([key, value]) => {
      digitToChar[key] = value;
    });
  }

  return {
    ...options,
    digitToChar,
  };
}

export const CounterPartsMixin = <
  V extends AvailableNumberAdapterValueType,
  T extends ReturnType<typeof CounterBaseMixin<V>> = ReturnType<
    typeof CounterBaseMixin<V>
  >,
>(
  superClass: T,
) => {
  class CounterPartsMixinClass extends superClass {
    private static DEFAULT_PARTS_OPTIONS: InnerPartsOptions = {
      sampleCount: 16,
      decimalSeparator: '.',
      fillChar: '0',
      minPlaces: [1, 0],
      digitToChar: {},
    };

    /**
     * 这是 `usePartData` 的配置项. `usePartData` 被用于从数值的变化中生成用于滚动的数据.
     * 这里不会有太多解释, 因为它是一个底层的配置项. 你可以查看 `CounterPartsMixinClass` 的源码了解更多信息.
     */
    @property({
      type: Object,
      attribute: 'parts-options',
      converter: value => {
        const parsedValue = parseJsonString(value ?? '') ?? {};
        return {
          ...CounterPartsMixinClass.DEFAULT_PARTS_OPTIONS,
          ...parsedValue,
        };
      },
    })
    partsOptions: InnerPartsOptions =
      CounterPartsMixinClass.DEFAULT_PARTS_OPTIONS;

    parts: PartData[] = [];

    oldParts: PartData[] = [];

    partPreprocessDataList: PartPreprocessedData[][] = [];

    sampling(from: V, to: V) {
      return transitionDigit(
        this.numberAdapter,
        this.numberAdapter.max(from, to),
        this.numberAdapter.min(from, to),
        this.partsOptions.sampleCount,
      );
    }

    // eslint-disable-next-line class-methods-use-this
    sampleSplit(samples: V[]) {
      return [samples.slice()];
    }

    sampleToString(value: V) {
      return this.numberAdapter.toString(value);
    }

    override willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (changedProperties.has('partsOptions')) {
        this.partsOptions = preprocessPartsOptions(this.partsOptions);
      }

      if (
        changedProperties.has('value') ||
        changedProperties.has('partsOptions')
      ) {
        this.oldParts = this.parts;
        this.parts = this.processPartData();
        this.partPreprocessDataList = preprocessPartData(
          this.direction,
          this.parts,
          this.oldDirection,
          this.oldParts,
        );
      }

      /**
       * `value` 没变但 `direction` 变化时, 也要重新生成 `partPreprocessDataList`.
       */
      // todo test events 和 animationOptions 冲突
      // if (
      //   changedProperties.has('value') ||
      //   changedProperties.has('direction')
      // ) {
      // }
    }

    /**
     * process:
     * 1. 采样
     * 2. 转换
     * 3. 构造
     */
    private processPartData() {
      const { decimalSeparator, digitToChar, minPlaces, fillChar } =
        this.partsOptions;

      const from = this.value;
      const to = this.oldValue;

      const result: PartData[] = [];

      /**
       * 对 {@link from} 到 {@link to} 的范围采样.
       */
      const tempParts = this.sampleSplit(this.sampling(from, to));

      /**
       * 将时间部分的数字转换为用于滚动的字符串数组
       *
       * headNumber: 最先显示的数字. 向下滚动时, 为滚动列表的最后一个数字, 向上滚动时相反.
       * tailNumber: 最后显示的数字. 向下滚动时, 为滚动列表的第一个数字, 向上滚动时相反.
       */
      {
        const directionValue = this.numberAdapter.gt(from, to) ? 'down' : 'up';
        for (let i = 0; i < tempParts.length; i++) {
          const partData = tempParts[i];
          // const headNumber =
          //   partData[directionValue === "down" ? partData.length - 1 : 0];
          const tailNumber =
            partData[directionValue === 'down' ? 0 : partData.length - 1];

          const [minIntegerPlaces = 1, minDecimalPlaces = 0] = minPlaces;

          const numberParts =
            this.sampleToString(tailNumber).split(decimalSeparator);
          const integerPlaces = Math.max(
            numberParts[0].length,
            minIntegerPlaces,
          );
          const decimalPlaces = Math.max(
            numberParts[1]?.length ?? 0,
            minDecimalPlaces,
          );

          /**
           * 使用 zip 将二维矩阵, 旋转90度
           */
          const data = zip(
            ...partData.map(digitData => {
              // 保证位数一致, 向前补零
              const [integer = '', decimal = ''] =
                this.sampleToString(digitData).split(decimalSeparator);

              const filledIntegerPlaces = Math.max(
                integerPlaces - integer.length,
                0,
              );

              const filledDecimalPlaces = Math.max(
                decimalPlaces - decimal.length,
                0,
              );

              let filledChars = ([] as string[]).concat(
                new Array(filledIntegerPlaces).fill(fillChar),
                this.stringAdapter.stringToChars(integer),
              );
              if (decimalPlaces > 0) {
                filledChars = filledChars.concat(
                  [decimalSeparator],
                  this.stringAdapter.stringToChars(decimal),
                  new Array(filledDecimalPlaces).fill(fillChar),
                );
              }
              return filledChars;
            }),
          )
            /**
             * 删除连续的重复项
             */
            .map((digitList, index, array) => ({
              data: digitList
                .filter(
                  (digit, digitIndex, digitArray) =>
                    digitIndex === 0 || digit !== digitArray[digitIndex - 1],
                )
                .map(digit => digitToChar[digit] ?? digit),
              place: array.length - index,
            }));

          result.push({
            digits: data,
          });
        }
      }

      return result;
    }
  }

  return CounterPartsMixinClass as Constructor<CounterPartsMixinInterface<V>> &
    T;
};
