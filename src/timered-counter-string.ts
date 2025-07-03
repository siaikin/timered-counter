import { isEmpty, isString } from 'remeda';
import { TimeredCounter } from './timered-counter.js';
import { timeredCounterStringStyles } from './styles/timered-counter-string-styles.js';
import { anyBase } from './utils/any-base.js';
import { PartsOptions } from './mixins/counter-parts.js';
import { AvailableNumberAdapterValueType } from './number-adapter/index.js';
import { graceDefineCustomElement } from './utils/grace-define-custom-element.js';

/**
 * 替换一些特定的字符.
 * 1. " ": 空格字符在 HTML 中会被忽略导致无法计算字符宽度, 使用 \xa0 替换.
 */
const REPLACED_CHARS: Record<string, string> = {
  ' ': '\xa0', // &nbsp;
};

export class TimeredCounterString extends TimeredCounter {
  static styles = [...TimeredCounter.styles, timeredCounterStringStyles];

  // /**
  //  * 自定义字符集, 传入的 `value` 的字符串表示形式的每个字符都**必须**被包含在该字符集中.
  //  *
  //  * @default `value` 的去重字符集.
  //  */
  // @property({
  //   reflect: true,
  // })
  private __alphabet: string = '';

  private __initialValueString = '';

  get initialValue() {
    return super.initialValue;
  }

  set initialValue(value: any) {
    if (!isString(value)) {
      try {
        value = value.toString();
      } catch (error) {
        throw new Error(`value ${value} is not a string.`);
      }
    }

    this.__initialValueString = value ?? '';

    if (isEmpty(this.__initialValueString)) {
      super.initialValue = this.numberAdapter.create(0);
      return;
    }

    /**
     * `initialValue` 在初始化时会被赋值给 `oldValue`, 因此, 同步更新逻辑与 `value` 的 setter 一致.
     */
    this.__updateAlphabet(this.__valueString, this.__initialValueString);
    super.initialValue = this.numberAdapter.create(
      this.__anyBaseToDecimal(this.__initialValueString),
    );
    super.value = this.numberAdapter.create(
      this.__anyBaseToDecimal(this.__valueString),
    );
  }

  private __valueString = '';

  private __oldValueString = '';

  get value() {
    return super.value;
  }

  /**
   * 通过 property 设置 value 时, 支持任意字符串.
   */
  set value(value: any) {
    if (!isString(value)) {
      try {
        value = value.toString();
      } catch (error) {
        throw new Error(`value ${value} is not a string.`);
      }
    } else if (this.__valueString === value) {
      return;
    }

    this.__oldValueString = this.__valueString;
    this.__valueString = value ?? '';

    if (isEmpty(this.__valueString)) {
      super.value = this.numberAdapter.create(0);
      return;
    }

    /**
     * 传入的 value 通过 `__anyBaseToDecimal` 转换为十进制数值, `__anyBaseToDecimal` 则基于 `__alphabet` 计算.
     * 因此, 当 `__alphabet` 更新时, 需要重新计算 `value` 和 `oldValue` 的值.
     * 以确保 `value` 和 `oldValue` 能够通过 `__decimalToAnyBase` 转换为原始字符串.
     */
    this.__updateAlphabet(this.__valueString, this.__oldValueString);
    super.oldValue = this.numberAdapter.create(
      this.__anyBaseToDecimal(this.__oldValueString),
    );
    super.value = this.numberAdapter.create(
      this.__anyBaseToDecimal(this.__valueString),
    );
  }

  private __partsOptions: Partial<PartsOptions> | null = null;

  get partsOptions(): Partial<PartsOptions> {
    return super.partsOptions;
  }

  set partsOptions(value: Partial<PartsOptions>) {
    this.__partsOptions = value;
    super.partsOptions = {
      type: 'string',
      fillChar: REPLACED_CHARS[' '],
      ...this.__partsOptions,
      digitToChar: {
        ' ': REPLACED_CHARS[' '],
        ...this.__partsOptions.digitToChar,
      },
    };
  }

  /**
   * 根据 `value`, `initialValue`, `oldValue` 更新字符集.
   * @private
   */
  private __updateAlphabet(value: string, oldValue: string) {
    const allChars =
      isEmpty(value) && isEmpty(oldValue)
        ? ''
        : `\x00${oldValue ?? ''}${value ?? ''}`;

    const charSet = new Set(this.stringAdapter.stringToChars(allChars));
    // if (charSet.size < 10) {
    //   for (let i = 0; i < 10; i++) {
    //     charSet.add(i.toString());
    //     if (charSet.size >= 10) break;
    //   }
    // }

    this.__alphabet = Array.from(charSet).sort().join('');

    const sa = this.stringAdapter;
    const alphabet = this.__alphabet;

    this.__decimalToAnyBase = anyBase(sa, '0123456789', alphabet);
    this.__anyBaseToDecimal = anyBase(sa, alphabet, '0123456789');
  }

  private __decimalToAnyBase = anyBase(
    this.stringAdapter,
    '0123456789',
    this.__alphabet,
  );

  private __anyBaseToDecimal = anyBase(
    this.stringAdapter,
    this.__alphabet,
    '0123456789',
  );

  override sampleToString(value: AvailableNumberAdapterValueType): string {
    return this.__decimalToAnyBase(this.numberAdapter.toString(value));
  }

  override connectedCallback() {
    this.__updateAlphabet(this.__valueString, this.__initialValueString);
    this.initialValue = this.__initialValueString;
    this.value = this.__valueString;

    /**
     * TimeredCounterString 有自定义的 `fillChar` 和 `digitToChar`. 实例化时需要手动触发 `partsOptions` 的 setter.
     */
    this.partsOptions = this.__partsOptions ?? {};

    super.connectedCallback();
  }
}

graceDefineCustomElement('timered-counter-string', TimeredCounterString);
