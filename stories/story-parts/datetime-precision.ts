import { StoryObj } from '@storybook/web-components';
import { addMilliseconds } from 'date-fns';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField, sleep } from '../utils/index.js';
import {
  DurationPartMillisecond,
  DurationPartType,
} from '../../src/types/duration.js';

export async function datetimePrecision<TC extends TimeredCounter>(
  context: Parameters<NoUndefinedField<StoryObj>['play']>[0],
  {
    counter,
    setBy,
  }: {
    counter: TC;
    setBy: (counter: TC, key: string, value: Date[] | string) => void;
    equal: (counter: TimeredCounter, a: any, b: Date[]) => Promise<void>;
  },
) {
  const { step, args } = context;

  const precisionTable = [
    [
      DurationPartType.Second,
      [DurationPartType.Second, DurationPartType.Second],
      [DurationPartType.Second, DurationPartType.Minute],
      [DurationPartType.Second, DurationPartType.Hour],
      [DurationPartType.Second, DurationPartType.Day],
      [DurationPartType.Second, DurationPartType.Month],
      [DurationPartType.Second, DurationPartType.Year],
    ],
    [
      DurationPartType.Minute,
      [DurationPartType.Minute, DurationPartType.Minute],
      [DurationPartType.Minute, DurationPartType.Hour],
      [DurationPartType.Minute, DurationPartType.Day],
      [DurationPartType.Minute, DurationPartType.Month],
      [DurationPartType.Minute, DurationPartType.Year],
    ],
    [
      DurationPartType.Hour,
      [DurationPartType.Hour, DurationPartType.Hour],
      [DurationPartType.Hour, DurationPartType.Day],
      [DurationPartType.Hour, DurationPartType.Month],
      [DurationPartType.Hour, DurationPartType.Year],
    ],
    [
      DurationPartType.Day,
      [DurationPartType.Day, DurationPartType.Day],
      [DurationPartType.Day, DurationPartType.Month],
      [DurationPartType.Day, DurationPartType.Year],
    ],
    [
      DurationPartType.Month,
      [DurationPartType.Month, DurationPartType.Month],
      [DurationPartType.Month, DurationPartType.Year],
    ],
    [DurationPartType.Year, [DurationPartType.Year, DurationPartType.Year]],
  ];
  const DurationPartTypeLevelMap: Record<DurationPartType, number> = {
    [DurationPartType.Millisecond]: 0,
    [DurationPartType.Second]: 1,
    [DurationPartType.Minute]: 2,
    [DurationPartType.Hour]: 3,
    [DurationPartType.Day]: 4,
    [DurationPartType.Week]: 5,
    [DurationPartType.Month]: 6,
    [DurationPartType.Quarter]: 7,
    [DurationPartType.Year]: 8,
  };

  await step('Test different precision', async () => {
    for await (const [singlePrecision, ...pairPrecisions] of precisionTable) {
      await step(`Single parameter: ${singlePrecision}`, async () => {
        setBy(counter, 'precision', singlePrecision as DurationPartType);
        setBy(counter, 'value', [
          new Date(),
          addMilliseconds(
            new Date(),
            DurationPartMillisecond[singlePrecision as DurationPartType],
          ),
        ]);

        await sleep((args.animationOptions.duration ?? 100) + 10);

        await expect(counter.parts.length).toBe(1);
      });

      await step(`Pair precision: ${singlePrecision}`, async () => {
        for await (const pairPrecision of pairPrecisions) {
          const [min, max] = pairPrecision as [
            DurationPartType,
            DurationPartType,
          ];
          setBy(counter, 'precision', JSON.stringify([min, max]));
          setBy(counter, 'value', [
            new Date(),
            addMilliseconds(new Date(), DurationPartMillisecond[max] + 1),
          ]);

          await sleep((args.animationOptions.duration ?? 100) + 10);

          await expect(counter.parts.length).toBe(
            DurationPartTypeLevelMap[max] - DurationPartTypeLevelMap[min] + 1,
          );
        }
      });
    }
  });
}
