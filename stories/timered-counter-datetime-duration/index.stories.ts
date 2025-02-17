import {
  Meta,
  setCustomElementsManifest,
  StoryObj,
} from '@storybook/web-components';
import { isArray, range } from 'remeda';
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  differenceInMilliseconds,
} from 'date-fns';
import { expect } from '@storybook/test';
import customElementsManifest from '../../custom-elements.json' with { type: 'json' };
import {
  setNumberAdapter,
  type TimeredCounter,
  TimeredCounterDatetimeDuration,
} from '../../src/index.js';
import { sleep } from '../utils/index.js';
import {
  DurationPartMillisecond,
  DurationPartType,
} from '../../src/types/duration.js';

setCustomElementsManifest(customElementsManifest);

function setByAttr(
  element: TimeredCounter,
  attr: string,
  value: Date[] | string,
) {
  if (isArray(value)) {
    element.setAttribute(
      attr,
      JSON.stringify(value.map(date => date.getTime())),
    );
  } else {
    element.setAttribute(attr, value);
  }
}

function setByProp(element: TimeredCounter, prop: string, value: any) {
  // @ts-ignore
  element[prop] = value;
}

function equal(counter: TimeredCounter, a: any, b: any) {
  const na = counter.numberAdapter;
  return expect(na.toString(a)).toBe(na.toString(na.create(b)));
}

const meta: Meta = {
  title: 'TimeredCounterDatetimeDuration',
  component: 'timered-counter-datetime-duration',
  tags: ['autodocs', 'timered-counter-datetime-duration'],
  parameters: {
    controls: { expanded: true },
  },
  beforeEach: () => {
    setNumberAdapter('number');
  },
};
export default meta;

export const Basic: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    value: 0,
    animationOptions: {
      duration: 100,
    },
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      'timered-counter-datetime-duration',
    ) as TimeredCounterDatetimeDuration;

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      const list = [
        ...range(0, 2).map(v => [new Date(), addSeconds(new Date(), v)]),
        ...range(0, 2).map(v => [new Date(), addMinutes(new Date(), v)]),
        ...range(0, 2).map(v => [new Date(), addHours(new Date(), v)]),
        ...range(0, 2).map(v => [new Date(), addDays(new Date(), v)]),
        ...range(0, 2).map(v => [new Date(), addMonths(new Date(), v)]),
        ...range(0, 2).map(v => [new Date(), addYears(new Date(), v)]),
      ];

      await step('Incrementing the value', async () => {
        for (let i = 0; i < list.length; i++) {
          setBy(counter, 'value', list[i]);
          // eslint-disable-next-line no-await-in-loop
          await sleep(110);
          // eslint-disable-next-line no-await-in-loop
          await equal(
            counter,
            counter.value,
            differenceInMilliseconds(list[i][1], list[i][0]),
          );
        }
      });

      await step('Decrementing the value', async () => {
        for (let i = 0; i < list.length; i++) {
          setBy(counter, 'value', list[list.length - i - 1]);
          // eslint-disable-next-line no-await-in-loop
          await sleep(110);
          // eslint-disable-next-line no-await-in-loop
          await equal(
            counter,
            counter.value,
            differenceInMilliseconds(
              list[list.length - i - 1][1],
              list[list.length - i - 1][0],
            ),
          );
        }
      });

      /**
       * todo 应该期望抛出异常, 但 storybook toThrow 无法正常工作.
       * @see https://github.com/storybookjs/storybook/issues/28406
       */
      // await step('Edge case', async () => {
      //   // value 为空
      //   await step('Setting the value to an empty string', async () => {
      //     setBy(counter, 'value', '');
      //     // await sleep(110);
      //     // await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为非数字
      //   await step('Setting the value to a non-number', async () => {
      //     setBy(counter, 'value', 'a');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为负数
      //   await step('Setting the value to a negative number', async () => {
      //     setBy(counter, 'value', '-1');
      //     await sleep(110);
      //     await equal(counter, counter.value, -1);
      //   });
      //
      //   // value 为 Infinity
      //   await step('Setting the value to Infinity', async () => {
      //     setBy(counter, 'value', 'Infinity');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 NaN
      //   await step('Setting the value to NaN', async () => {
      //     setBy(counter, 'value', 'NaN');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 null
      //   await step('Setting the value to null', async () => {
      //     setBy(counter, 'value', 'null');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 undefined
      //   await step('Setting the value to undefined', async () => {
      //     setBy(counter, 'value', 'undefined');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 true
      //   await step('Setting the value to true', async () => {
      //     setBy(counter, 'value', 'true');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 false
      //   await step('Setting the value to false', async () => {
      //     setBy(counter, 'value', 'false');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为对象
      //   await step('Setting the value to an object', async () => {
      //     setBy(counter, 'value', '{}');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为数组
      //   await step('Setting the value to an array', async () => {
      //     setBy(counter, 'value', '[]');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为函数
      //   await step('Setting the value to a function', async () => {
      //     setBy(counter, 'value', '() => {}');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 Symbol
      //   await step('Setting the value to a Symbol', async () => {
      //     setBy(counter, 'value', 'Symbol()');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      //
      //   // value 为 BigInt
      //   await step('Setting the value to a BigInt', async () => {
      //     setBy(counter, 'value', 'BigInt(1)');
      //     await sleep(110);
      //     await equal(counter, counter.value, 0);
      //   });
      // });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};

export const Precision: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    value: 0,
    animationOptions: {
      duration: 100,
    },
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      'timered-counter-datetime-duration',
    ) as TimeredCounterDatetimeDuration;

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      counter.precision = [DurationPartType.Second, DurationPartType.Day];

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
        for await (const [
          singlePrecision,
          ...pairPrecisions
        ] of precisionTable) {
          await step(`Single precision: ${singlePrecision}`, async () => {
            setBy(counter, 'precision', singlePrecision as DurationPartType);
            setBy(counter, 'value', [
              new Date(),
              addMilliseconds(
                new Date(),
                DurationPartMillisecond[singlePrecision as DurationPartType],
              ),
            ]);

            await sleep(110);
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

              await sleep(110);
              await expect(counter.parts.length).toBe(
                DurationPartTypeLevelMap[max] -
                  DurationPartTypeLevelMap[min] +
                  1,
              );
            }
          });
        }
      });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};

export const Locale: StoryObj<TimeredCounterDatetimeDuration> = {
  args: {
    value: 0,
    animationOptions: {
      duration: 100,
    },
    precision: [DurationPartType.Second, DurationPartType.Day],
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      'timered-counter-datetime-duration',
    ) as TimeredCounterDatetimeDuration;

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      const locales = [
        ['zh-CN', ['日', '小时', '分钟', '秒']],
        ['zh-HK', ['日', '小時', '分鐘', '秒']],
        ['zh-TW', ['日', '小時', '分鐘', '秒']],
        ['en-US', ['day', 'hour', 'minute', 'second']],
        ['en-GB', ['day', 'hour', 'minute', 'second']],
        ['fr-FR', ['jour', 'heure', 'minute', 'seconde']],
        ['de-DE', ['Tag', 'Stunde', 'Minute', 'Sekunde']],
        ['ja-JP', ['日', '時', '分', '秒']],
        ['ko-KR', ['일', '시', '분', '초']],
      ];

      await step('Test different locale', async () => {
        for await (const [locale, testTarget] of locales) {
          setBy(counter, 'locale', locale as string);

          await sleep(110);

          const partSuffixes = Array.from(
            (counter.shadowRoot
              ?.querySelector('timered-counter-roller')
              ?.shadowRoot?.querySelectorAll('.roller-part__suffix slot') ??
              []) as HTMLSlotElement[],
          ).map(el => el.assignedElements()[0].textContent?.trim());

          await expect(partSuffixes).toEqual(testTarget);
        }
      });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};
