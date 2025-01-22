export enum DurationPartType {
  Millisecond = 'millisecond',
  Second = 'second',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}

export const DurationPartMillisecond = {
  [DurationPartType.Millisecond]: 1,
  [DurationPartType.Second]: 1000,
  [DurationPartType.Minute]: 60000,
  [DurationPartType.Hour]: 3600000,
  [DurationPartType.Day]: 86400000,
  [DurationPartType.Week]: 604800000,
  [DurationPartType.Month]: 2629800000,
  [DurationPartType.Quarter]: 7889400000,
  [DurationPartType.Year]: 31557600000,
} as const;

export const DurationPartMillisecondToType = {
  1: DurationPartType.Millisecond,
  1000: DurationPartType.Second,
  60000: DurationPartType.Minute,
  3600000: DurationPartType.Hour,
  86400000: DurationPartType.Day,
  604800000: DurationPartType.Week,
  2629800000: DurationPartType.Month,
  7889400000: DurationPartType.Quarter,
  31557600000: DurationPartType.Year,
} as const;
