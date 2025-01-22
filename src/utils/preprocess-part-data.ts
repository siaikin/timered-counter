import { isDeepEqual } from 'remeda';
import { PartData, PartDataDigit } from '../types/group.js';

export interface PartPreprocessedData {
  /**
   * 是否需要启动动画
   */
  animate: boolean;
  /**
   * 是否需要移除上一次的动画设置的样式
   */
  cancelPrevAnimation: boolean;
  earlyReturn?: string;
  /**
   * 全局索引
   */
  index: number;
  /**
   * 所在 `part` 的索引
   */
  partIndex: number;
  /**
   * 所在 `digit` 的索引
   */
  digitIndex: number;
}

/**
 * 以下代码块用于判断是否需要启动滚动动画.
 * 下列情况将跳过滚动动画:
 * 1. 当新的滚动数据(即 digits)长度为 1 时.
 * 2. 当滚动方向未改变时:
 *    1. 当滚动数据头尾相同时.
 *    2. 当前滚动数据与上一次全等时.
 */
function rollerPartTest(
  direction: ['up' | 'down', 'up' | 'down' | undefined],
  digits: [PartDataDigit, PartDataDigit | undefined],
) {
  const [newDirection, oldDirection] = direction;
  const [newDigits, oldDigits] = digits;

  const result: Pick<
    PartPreprocessedData,
    'animate' | 'cancelPrevAnimation' | 'earlyReturn'
  > = {
    animate: true,
    cancelPrevAnimation: false,
  };
  let earlyReturn = '';
  if (newDigits.data.length === 1) {
    result.animate = false;
    result.cancelPrevAnimation = true;
    earlyReturn = 'only one digit';
  }

  if (newDirection !== oldDirection) return result;

  if (newDigits.data[0] === newDigits.data[newDigits.data.length - 1]) {
    result.animate = false;
    result.cancelPrevAnimation = true;
    earlyReturn = 'same head and tail';
  }

  if (isDeepEqual(newDigits, oldDigits)) {
    result.animate = false;
    earlyReturn = 'same digits';
  }

  if (earlyReturn) result.earlyReturn = earlyReturn;

  return result;
}

export function preprocessPartData(
  newDirection: 'up' | 'down',
  newData: PartData[],
  oldDirection: 'up' | 'down',
  oldData: PartData[],
) {
  const results: PartPreprocessedData[][] = [];

  let globalIndex = 0;
  for (let i = 0; i < newData.length; i++) {
    const newPart = newData[i];
    const oldPart = oldData?.[i];

    const partDataResults: PartPreprocessedData[] = [];
    for (let j = 0; j < newPart.digits.length; j++) {
      const newDigit = newPart.digits[j];
      const oldDigit = oldPart?.digits.find(d => d.place === newDigit.place);

      partDataResults.push({
        ...rollerPartTest([newDirection, oldDirection], [newDigit, oldDigit]),
        index: globalIndex++,
        partIndex: i,
        digitIndex: j,
      });
    }
    results.push(partDataResults);
  }

  return results;
}
