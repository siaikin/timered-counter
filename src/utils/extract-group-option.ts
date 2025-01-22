import { isArray, isFunction } from 'remeda';
import {
  GroupValueOrGetter,
  PartValueOrGetter,
  ExtractGroupValue,
  ExtractPartValue,
  GroupGetter,
  PartDigitValueOrGetter,
  PartDigitCellValueOrGetter,
  ExtractPartDigitCellValue,
  ExtractPartDigitValue,
  GroupGetterOptions,
} from '../types/group.js';

export function extractGroupOption<
  P extends GroupValueOrGetter<unknown>,
  Result = ExtractGroupValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  return (
    isFunction(option)
      ? (option as GroupGetter<ExtractGroupValue<P>>)(getterOptions)
      : option
  ) as Result;
}

export function extractPartOption<
  P extends PartValueOrGetter<unknown>,
  Result = ExtractPartValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const groupOption = extractGroupOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const value = isArray(groupOption) ? groupOption[i] : groupOption;
    result.push(value as Result);
  }

  return result;
}

export function extractPartDigitOption<
  P extends PartDigitValueOrGetter<unknown>,
  Result = ExtractPartDigitValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const extractedOption = extractPartOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[][] = [];
  for (let i = 0; i < data.length; i += 1) {
    const { digits } = data[i];
    const partOption = extractedOption[i];

    result.push([]);

    for (let j = 0; j < digits.length; j += 1) {
      const value = isArray(partOption) ? partOption[j] : partOption;
      result[i].push(value as Result);
    }
  }

  return result;
}

export function extractPartDigitCellOption<
  P extends PartDigitCellValueOrGetter<unknown>,
  Result = ExtractPartDigitCellValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const extractedOption = extractPartDigitOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[][][] = [];
  for (let i = 0; i < data.length; i += 1) {
    const { digits } = data[i];
    const partOption = extractedOption[i];

    result.push([]);

    for (let j = 0; j < digits.length; j += 1) {
      const { data: digitData } = digits[j];
      const partDigitOption = partOption[j];

      result[i].push([]);

      for (let k = 0; k < digitData.length; k += 1) {
        const value = isArray(partDigitOption)
          ? partDigitOption[k]
          : partDigitOption;
        result[i][j].push(value as Result);
      }
    }
  }

  return result;
}
