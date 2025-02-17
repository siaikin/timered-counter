import { LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isNonNullish, isNullish, isString } from 'remeda';
import { Constructor } from 'type-fest';
import {
  NumberAdapter,
  AvailableNumberAdapterValueType,
} from '../number-adapter/index.js';
import { StringAdapter } from '../string-adapter/index.js';
import { CounterAdapter } from '../counter-adapter.js';

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
    private __value: V = CounterAdapter.NUMBER_ADAPTER.create(0);

    @property({
      attribute: 'value',
      reflect: true,
      converter: {
        toAttribute: CounterAdapter.VALUE_CONVERTER.toAttribute,
      },
      noAccessor: true,
    })
    get value() {
      return this.numberAdapter.create(this.__value);
    }

    set value(value: V) {
      value = CounterAdapter.NUMBER_ADAPTER.create(
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

    private __oldValue: V = CounterAdapter.NUMBER_ADAPTER.create(0);

    @property({
      attribute: 'old-value',
      reflect: true,
      converter: CounterAdapter.VALUE_CONVERTER,
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

    private __initialValue: V = CounterAdapter.NUMBER_ADAPTER.create(0);

    /**
     * 如果初始值被设置, 组件初始化时会使用该值而不是 `value`, 然后在初始化完成后, 将内部值更新为 `value`.
     *
     * 这对于初始化完成后启动动画效果非常有用.
     */
    @property({
      attribute: 'initial-value',
      reflect: true,
      converter: CounterAdapter.VALUE_CONVERTER,
    })
    get initialValue() {
      return this.numberAdapter.create(this.__initialValue);
    }

    set initialValue(value: V) {
      const old = this.__initialValue;
      this.__initialValue = value;
      this.requestUpdate('initialValue', old);
    }
    // initialValue: V = CounterBaseMixinClass.NUMBER_ADAPTER.create(0);

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
      this.numberAdapter = CounterAdapter.NUMBER_ADAPTER;
      // @ts-ignore
      this.stringAdapter = CounterAdapter.STRING_ADAPTER;
    }

    /**
     * 第一次更新时, changedProperties 中 value 的旧值始终为 undefined.
     * 因此, 当 value 第一次更新时, oldValue 的值应当来自 initialValue 或 value.
     * 以保证 oldValue 始终有值.
     * @private
     */
    private isValueFirstUpdate = true;

    override willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (changedProperties.has('value')) {
        if (this.isValueFirstUpdate) {
          this.isValueFirstUpdate = false;
          this.oldValue = isNonNullish(this.initialValue)
            ? this.initialValue
            : this.value;
        } else {
          this.oldValue = changedProperties.get('value') ?? this.oldValue;
        }
      }

      this.oldDirection = this.direction;
      this.direction = this.numberAdapter.gt(this.value, this.oldValue)
        ? 'down'
        : 'up';
      // }
    }
  }

  return CounterBaseMixinClass as Constructor<CounterBaseMixinInterface<V>> & T;
};
