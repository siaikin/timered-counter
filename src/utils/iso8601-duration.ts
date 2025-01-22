import { isNumber } from 'remeda';
import { DurationPartType } from '../types/duration.js';

const ISO8601DurationMarker = {
  [DurationPartType.Year]: 'Y',
  [DurationPartType.Month]: 'M',
  [DurationPartType.Week]: 'W',
  [DurationPartType.Day]: 'D',
  [DurationPartType.Hour]: 'H',
  [DurationPartType.Minute]: 'M',
  [DurationPartType.Second]: 'S',
} as const;

const DateParts = [
  DurationPartType.Year,
  DurationPartType.Month,
  DurationPartType.Week,
  DurationPartType.Day,
] as const;
const TimeParts = [
  DurationPartType.Hour,
  DurationPartType.Minute,
  DurationPartType.Second,
] as const;

export function iso8601Duration(duration: {
  [key in DurationPartType]?: number;
}): string {
  const datePart = DateParts.map(part =>
    isNumber(duration[part])
      ? `${duration[part]}${ISO8601DurationMarker[part]}`
      : '',
  );
  const timePart = TimeParts.map(part =>
    isNumber(duration[part])
      ? `${duration[part]}${ISO8601DurationMarker[part]}`
      : '',
  );
  return `P${datePart.join('')}T${timePart.join('')}`;
}
