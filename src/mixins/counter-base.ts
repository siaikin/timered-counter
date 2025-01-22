import { LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isNonNullish, isNullish, isString } from 'remeda';
import { Constructor } from 'type-fest';
import {
  BuildInNumberAdapter,
  NumberAdapter,
} from '../number-adapter/index.js';
import {
  BuildInStringAdapter,
  StringAdapter,
} from '../string-adapter/index.js';

// const numberAdapters = {
//   number: BuildInNumberAdapter(),
//   'decimal.js': DecimalJsAdapter(),
// } as const;
// const stringAdapters = {
//   string: BuildInStringAdapter(),
//   'intl-segmenter': BuildInIntlSegmenterAdapter(),
//   'grapheme-splitter': GraphemeSplitterAdapter(),
// } as const;

export declare class CounterBaseMixinInterface<V> {
  value: V;

  oldValue: V;

  initialValue?: V;

  direction: 'up' | 'down';

  locale:
    | Intl.UnicodeBCP47LocaleIdentifier
    | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions];

  localeInstance: Intl.Locale;

  numberAdapter: NumberAdapter;

  stringAdapter: StringAdapter;
}

export const CounterBaseMixin = <
  V,
  T extends Constructor<LitElement> = Constructor<LitElement>,
>(
  superClass: T,
) => {
  class CounterBaseMixinClass extends superClass {
    /**
     * 数字适配器, 有以下两种:
     * 1. BuildInNumberAdapter(默认): 使用内置 number 进行计算.
     * 2. DecimalJsAdapter: 使用 Decimal.js 进行计算.
     *
     * 详细信息请查看[字符长度限制](/guide/optional-dependencies#字符长度限制)章节.
     *
     * @default BuildInNumberAdapter
     */
    static NUMBER_ADAPTER: NumberAdapter = BuildInNumberAdapter();

    /**
     * 字符串适配器, 有以下两种:
     * 1. BuildInStringAdapter(默认): 使用内置 string 进行字符串处理.
     * 2. BuildInIntlSegmenterAdapter: 使用 Intl.Segmenter 进行字符串处理. 能够支持 emoji, 字符集.
     * 3. GraphemeSplitterAdapter: 使用 grapheme-splitter 进行字符串处理. 能够支持 emoji, 字符集.
     *
     * 详细信息请查看[支持 emoji 分词](/guide/optional-dependencies#支持-emoji-分词)章节.
     *
     * @default BuildInStringAdapter
     */
    static STRING_ADAPTER: StringAdapter = BuildInStringAdapter();

    @property({ attribute: 'value', reflect: true })
    value: V = '' as unknown as V;

    @property({ attribute: 'old-value', reflect: true })
    oldValue: V = '' as unknown as V;

    /**
     * 如果初始值被设置, 组件初始化时会使用该值而不是 `value`, 然后在初始化完成后, 将内部值更新为 `value`.
     *
     * 这可以实现在初始化完成后启动动画效果非常有用.
     */
    @property({ attribute: 'initial-value', reflect: true })
    initialValue: V = '' as unknown as V;

    /**
     * 自定义本地化配置, 否则从浏览器环境中获取.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
     *
     * @default "en-US"
     */
    @property({
      converter: value => {
        if (isNullish(value)) return value;

        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      },
    })
    locale:
      | Intl.UnicodeBCP47LocaleIdentifier
      | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions] = 'en-US';

    @state()
    localeInstance: Intl.Locale = isString(this.locale)
      ? new Intl.Locale(this.locale)
      : new Intl.Locale(...this.locale);

    @state()
    direction: 'up' | 'down' = 'up';

    numberAdapter = CounterBaseMixinClass.NUMBER_ADAPTER;

    stringAdapter = CounterBaseMixinClass.STRING_ADAPTER;

    private isFirstUpdate = true;

    connectedCallback() {
      super.connectedCallback();

      this.oldValue =
        isNonNullish(this.initialValue) && this.initialValue !== ''
          ? this.initialValue
          : this.value;
    }

    willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (changedProperties.has('value')) {
        if (this.isFirstUpdate) {
          this.isFirstUpdate = false;
        } else {
          this.oldValue = changedProperties.get('value') as V;
        }

        this.direction = this.numberAdapter.gt(this.value, this.oldValue)
          ? 'down'
          : 'up';
      }

      if (changedProperties.has('locale')) {
        this.localeInstance = isString(this.locale)
          ? new Intl.Locale(this.locale)
          : new Intl.Locale(...this.locale);
      }
    }
  }

  return CounterBaseMixinClass as Constructor<CounterBaseMixinInterface<V>> & T;
};
