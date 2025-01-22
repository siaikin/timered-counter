import {
  differenceInMilliseconds,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInQuarters,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  subDays,
  subHours,
  subMilliseconds,
  subMinutes,
  subMonths,
  subQuarters,
  subSeconds,
  subWeeks,
  subYears,
} from 'date-fns';
import { DurationPartType } from '../types/duration.js';

/**
 * 计算两个日期之间的时间间隔. 返回一个数组, 包含 {@link parts} 每个部分的值.
 *
 * @example duration(new Date("2022-01-01"), new Date("2022-01-02"), [DurationPartType.Day, DurationPartType.Hour, DurationPartType.Minute, DurationPartType.Second]) // [1, 0, 0, 0]
 * @example duration(new Date("2022-01-01 12:00:00"), new Date("2022-01-02 12:30:00"), [DurationPartType.Day, DurationPartType.Hour, DurationPartType.Minute, DurationPartType.Second]) // [1, 0, 30, 0]
 *
 * @param start
 * @param end
 * @param parts
 */
export function durationObject(
  start: Date,
  end: Date,
  parts: DurationPartType[],
): { [key in DurationPartType]?: number } {
  let remain = end;

  const result: { [key in DurationPartType]?: number } = {};
  for (const part of parts) {
    let value = 0;

    switch (part) {
      case DurationPartType.Year:
        value = differenceInYears(remain, start);
        remain = subYears(remain, value);
        break;
      case DurationPartType.Quarter:
        value = differenceInQuarters(remain, start);
        remain = subQuarters(remain, value);
        break;
      case DurationPartType.Month:
        value = differenceInMonths(remain, start);
        remain = subMonths(remain, value);
        break;
      case DurationPartType.Week:
        value = differenceInWeeks(remain, start);
        remain = subWeeks(remain, value);
        break;
      case DurationPartType.Day:
        value = differenceInDays(remain, start);
        remain = subDays(remain, value);
        break;
      case DurationPartType.Hour:
        value = differenceInHours(remain, start);
        remain = subHours(remain, value);
        break;
      case DurationPartType.Minute:
        value = differenceInMinutes(remain, start);
        remain = subMinutes(remain, value);
        break;
      case DurationPartType.Second:
        value = differenceInSeconds(remain, start);
        remain = subSeconds(remain, value);
        break;
      case DurationPartType.Millisecond:
        value = differenceInMilliseconds(remain, start);
        remain = subMilliseconds(remain, value);
        break;
      default:
        throw new Error(`Unknown duration part: ${part}`);
    }

    result[part] = value;
  }

  return result;
}

export function duration(
  start: Date,
  end: Date,
  parts: DurationPartType[],
): number[] {
  const obj = durationObject(start, end, parts);
  return parts.map(part => obj[part]) as number[];
}
