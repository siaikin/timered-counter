import { LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isNonNullish, isNullish, isString } from 'remeda';
import { Constructor } from 'type-fest';
import {
  NumberAdapter,
  AvailableNumberAdapterValueType,
} from '../number-adapter/index.js';
import { StringAdapter } from '../string-adapter/index.js';
import { TimeredCounterAdapter } from '../timered-counter-adapter.js';

export declare class CounterBaseMixinInterface<
  V extends AvailableNumberAdapterValueType,
> {
  static NUMBER_ADAPTER: NumberAdapter;

  static STRING_ADAPTER: StringAdapter;

  get value(): V;

  set value(value: V);

  get oldValue(): V;

  set oldValue(value: V);

  get initialValue(): V;

  set initialValue(value: V);

  direction: 'up' | 'down';

  oldDirection: 'up' | 'down';

  locale:
    | Intl.UnicodeBCP47LocaleIdentifier
    | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions];

  localeInstance: Intl.Locale;

  numberAdapter: NumberAdapter;

  stringAdapter: StringAdapter;
}

export const CounterBaseMixin = <
  V extends AvailableNumberAdapterValueType,
  T extends Constructor<LitElement> = Constructor<LitElement>,
>(
  superClass: T,
) => {
  class CounterBaseMixinClass extends superClass {
    private __value: V = TimeredCounterAdapter.NUMBER_ADAPTER.create(0);

    @property({
      attribute: 'value',
      reflect: true,
      converter: {
        toAttribute: TimeredCounterAdapter.VALUE_CONVERTER.toAttribute,
      },
      noAccessor: true,
    })
    get value() {
      return this.numberAdapter.create(this.__value);
    }

    set value(value: V) {
      value = TimeredCounterAdapter.NUMBER_ADAPTER.create(
        isNullish(value) || (isString(value) && value.trim() === '')
          ? 0
          : value,
      );

      const old = this.__value;
      this.__value = value;

      if (!this.numberAdapter.eq(this.__value, old)) {
        this.requestUpdate('value', old);
      }
    }
    // value: V = CounterBaseMixinClass.NUMBER_ADAPTER.create(0);

    private __oldValue: V = TimeredCounterAdapter.NUMBER_ADAPTER.create(0);

    /**
     * 用于记录上一次的值.
     *
     * 初始化时({@link connectedCallback}), oldValue 将被设置为 `initialValue` 或 `value` 的值.
     */
    @property({
      attribute: 'old-value',
      reflect: true,
      converter: TimeredCounterAdapter.VALUE_CONVERTER,
      noAccessor: true,
    })
    get oldValue() {
      return this.numberAdapter.create(this.__oldValue);
    }

    set oldValue(value: V) {
      const old = this.__oldValue;
      this.__oldValue = value;
      this.requestUpdate('oldValue', old);
    }
    // oldValue: V = CounterBaseMixinClass.NUMBER_ADAPTER.create(0);

    private __initialValue: V | null = null;

    /**
     * 如果初始值被设置, {@link oldValue} 的初始值, 会使用该值而不是 `value`.
     *
     * 这对于初始化完成后启动动画效果非常有用.
     */
    @property({
      attribute: 'initial-value',
      reflect: true,
      converter: TimeredCounterAdapter.VALUE_CONVERTER,
      noAccessor: true,
    })
    get initialValue() {
      return isNullish(this.__initialValue)
        ? this.__initialValue
        : this.numberAdapter.create(this.__initialValue);
    }

    set initialValue(value: V | null) {
      const old = this.__initialValue;
      this.__initialValue = value;
      this.requestUpdate('initialValue', old);
    }

    private __locale:
      | Intl.UnicodeBCP47LocaleIdentifier
      | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions] = 'en-US';

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
      reflect: true,
      noAccessor: true,
    })
    get locale() {
      return this.__locale;
    }

    set locale(
      value:
        | Intl.UnicodeBCP47LocaleIdentifier
        | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions],
    ) {
      const old = this.__locale;
      this.__locale = value;
      this.requestUpdate('locale', old);

      this.localeInstance = isString(this.__locale)
        ? new Intl.Locale(this.__locale)
        : new Intl.Locale(...this.__locale);
    }

    localeInstance: Intl.Locale = isString(this.locale)
      ? new Intl.Locale(this.locale)
      : new Intl.Locale(...this.locale);

    @state()
    direction: 'up' | 'down' = 'up';

    @state()
    oldDirection: 'up' | 'down' = this.direction;

    numberAdapter: NumberAdapter;

    stringAdapter: StringAdapter;

    constructor(...args: any[]) {
      super(...args);

      // @ts-ignore
      this.numberAdapter = TimeredCounterAdapter.NUMBER_ADAPTER;
      // @ts-ignore
      this.stringAdapter = TimeredCounterAdapter.STRING_ADAPTER;
    }

    override willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (
        changedProperties.has('value') &&
        !changedProperties.has('oldValue')
      ) {
        // oldValue 未被手动设置时, 使用默认策略更新 oldValue.
        this.oldValue = changedProperties.get('value') ?? this.value;
      }

      this.oldDirection = this.direction;
      if (!this.numberAdapter.eq(this.value, this.oldValue)) {
        this.direction = this.numberAdapter.gt(this.value, this.oldValue)
          ? 'down'
          : 'up';
      }
    }

    /**
     * oldValue 的默认初始值应当来自 initialValue 或 value.
     * 以保证 oldValue 始终有值.
     */
    override connectedCallback() {
      super.connectedCallback();

      this.oldValue = isNonNullish(this.initialValue)
        ? this.initialValue
        : this.value;
    }
  }

  return CounterBaseMixinClass as Constructor<CounterBaseMixinInterface<V>> & T;
};
