import { StoryObj } from '@storybook/web-components';
import { expect } from '@storybook/test';
import { TimeredCounter } from '../../src/index.js';
import { NoUndefinedField, sleep } from '../utils/index.js';

export async function datetimeLocale<TC extends TimeredCounter>(
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
  ] as const;

  await step('Test different locale', async () => {
    for await (const [locale, testTarget] of locales) {
      await step(`Locale: ${locale}`, async () => {
        setBy(counter, 'locale', locale);

        await sleep((args.animationOptions.duration ?? 100) + 10);

        const partSuffixes = Array.from(
          (counter.shadowRoot
            ?.querySelector('timered-counter-roller')
            ?.shadowRoot?.querySelectorAll('.roller-part__suffix slot') ??
            []) as HTMLSlotElement[],
        ).map(el => el.assignedElements()[0].textContent?.trim());

        await expect(partSuffixes).toEqual(testTarget);
      });
    }
  });
}
