import { PartPreprocessedData } from '../utils/preprocess-part-data.js';

export interface PartDataDigit {
  data: string[];
  /**
   * 这是数字的第几位
   * @example 1024 -> 4 是第 1 位, 2 是第 2 位, 0 是第 3 位, 1 是第 4 位
   */
  place: number;
}

export interface PartData {
  /**
   * 每个数字数位用于过渡动画的数据.
   * @example 1 -> 10
   * [
   *   ["0", "1"], // 第一个数位
   *   ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], // 第二个数位
   * ]
   */
  digits: PartDataDigit[];
  /**
   * 运动方向的头部数字. 向下运动时该值为数组的最后一个元素. 向上运动时该值为数组的第一个元素.
   * @deprecated
   */
  headNumber?: number;
  /**
   * 运动方向的尾部数字.
   @deprecated
   */
  tailNumber?: number;
}

/**
 * 1. T: 单个数值. 为所有 part 下的 digit 使用 T.
 * 2. T[]: 数组数值. 为第 `i` 个 part 下的所有 digit 使用 `T[i]` 值.
 * 3. T[][]: 二维数组数值. 为第 `i` 个 part 下的第 `j` 个 digit 使用 `T[i][j]` 值.
 * 4. (data: PartData[]) => T | T[] | T[][]: 同上
 */
export type GroupValue<T> = T | undefined;
export interface GroupGetterOptions {
  /**
   * 用于生成滚动列表的数据.
   */
  data: PartData[];
  /**
   * 滚动方向.
   */
  direction: 'up' | 'down';
  /**
   * 导致这次滚动发生的值. [新值, 旧值].
   */
  value: [unknown, unknown];
  preprocessData: PartPreprocessedData[][];
}
export type GroupGetter<T> = (options: GroupGetterOptions) => GroupValue<T>;
export type GroupValueOrGetter<T> = GroupValue<T> | GroupGetter<T>;

export type PartValue<T> = GroupValue<T> | GroupValue<T[]>;
export type PartGetter<T> = GroupGetter<T> | GroupGetter<T[]>;
export type PartValueOrGetter<T> = PartValue<T> | PartGetter<T>;

export type PartDigitValue<T> = PartValue<T> | PartValue<T[]>;
export type PartDigitGetter<T> = PartGetter<T> | PartGetter<T[]>;
export type PartDigitValueOrGetter<T> = PartDigitValue<T> | PartDigitGetter<T>;

export type PartDigitCellValue<T> = PartValue<T> | PartValue<T[]>;
export type PartDigitCellGetter<T> = PartGetter<T> | PartGetter<T[]>;
export type PartDigitCellValueOrGetter<T> =
  | PartDigitCellValue<T>
  | PartDigitCellGetter<T>;

export type ExtractGroupValue<T> =
  T extends GroupValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? V
      : U
    : never;

export type ExtractPartValue<T> =
  T extends PartValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractGroupValue<V>
      : U
    : never;

export type ExtractPartDigitValue<T> =
  T extends PartDigitValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractPartValue<V>
      : U
    : never;

export type ExtractPartDigitCellValue<T> =
  T extends PartDigitCellValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractPartDigitValue<V>
      : U
    : never;
