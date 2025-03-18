import { customElement, property, state } from 'lit/decorators.js';
import { html, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { isBoolean, isNullish } from 'remeda';
import { TimeredCounter } from './timered-counter.js';
import { AvailableNumberAdapterValueType } from './number-adapter/index.js';
import { timeredCounterNumberStyles } from './styles/timered-counter-number-styles.js';

@customElement('timered-counter-number')
export class TimeredCounterNumber extends TimeredCounter {
  static styles = [...TimeredCounter.styles, timeredCounterNumberStyles];

  /**
   * 本地化数字格式化配置. 传入 `true` 时使用浏览器的默认配置.
   *
   * 详细配置参数请参考 [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)
   *
   * @default false
   */
  @property({
    converter: value => {
      if (isNullish(value)) return false;

      try {
        return JSON.parse(value);
      } catch (error) {
        return true;
      }
    },
    reflect: true,
    attribute: 'locale-number',
  })
  localeNumber: Intl.NumberFormatOptions | boolean = false;

  localeNumberInstance: Intl.NumberFormat = new Intl.NumberFormat(
    this.localeInstance,
    isBoolean(this.localeNumber) ? {} : this.localeNumber,
  );

  /**
   * 本地化数字格式化配置中的小数点分隔符. 根据不同的地区可能是 `.` 或 `,`.
   * @see https://en.wikipedia.org/wiki/Decimal_separator
   */
  @state()
  localDecimalSeparator = '';

  /**
   * 本地化数字格式化配置中的分组分隔符.
   * @see https://en.wikipedia.org/wiki/Decimal_separator#Digit_grouping
   */
  @state()
  localeGroupingSeparator = '';

  override sampleToString(value: AvailableNumberAdapterValueType): string {
    return this.localeNumber
      ? // todo Intl.NumberFormat 最大支持 21 位数.
        this.localeNumberInstance.format(this.numberAdapter.toNumber(value))
      : this.numberAdapter.toString(value);
  }

  override render() {
    const cellStyles = this.extractCellStyles();
    const digitStyles = this.extractDigitStyles();
    const partStyles = this.extractPartStyles();

    const animationOptions = this.extractAnimationOptions();
    const keyframes = this.extractKeyframes();

    return html`
      <timered-counter-roller
        class="timered-counter timered-counter-datetime-duration"
        exportparts="group, part, digit, cell, prefix, suffix, part-suffix"
        part="group"
        aria-hidden="true"
        color=${this.color}
        .parentContainerRect=${this.partsContainerRect}
        .parts=${this.parts}
        .partPreprocessDataList=${this.partPreprocessDataList}
        .animationOptions=${animationOptions}
        .keyframes=${keyframes}
        .cellStyles=${cellStyles}
        .digitStyles=${digitStyles}
        .partStyles=${partStyles}
        .direction=${this.direction}
        @roller-animation-start=${this.dispatchTimeredCounterAnimationStart}
        @roller-animation-end=${this.dispatchTimeredCounterAnimationEnd}
      >
        <slot name="prefix" slot="prefix"></slot>
        <slot name="suffix" slot="suffix"></slot>
        ${repeat(
          this.parts,
          (_, index) => index,
          (_, partIndex) =>
            html`<slot
              name=${`part-suffix-${partIndex}`}
              slot=${`part-suffix-${partIndex}`}
            ></slot>`,
        )}
      </timered-counter-roller>
    `;
  }

  override willUpdate(_changedProperties: PropertyValues<this>) {
    if (
      _changedProperties.has('localeNumber') ||
      _changedProperties.has('locale')
    ) {
      this.localeNumberInstance = new Intl.NumberFormat(
        this.localeInstance,
        isBoolean(this.localeNumber) ? {} : this.localeNumber,
      );

      /**
       * 本地化数字格式化配置变化时, 更新 `partsOptions` 中的 `decimalSeparator`.
       */
      {
        const numberParts = this.localeNumberInstance.formatToParts(123456.789);

        const decimalSeparator =
          numberParts.find(part => part.type === 'decimal')?.value || '.';
        const groupingSeparator =
          numberParts.find(part => part.type === 'group')?.value || '';

        if (
          this.localDecimalSeparator !== decimalSeparator ||
          this.localeGroupingSeparator !== groupingSeparator
        ) {
          this.localDecimalSeparator = decimalSeparator;

          const oldPartsOptions = this.partsOptions;
          this.partsOptions = {
            ...oldPartsOptions,
            decimalSeparator: this.localDecimalSeparator,
          };
          _changedProperties.set('partsOptions', oldPartsOptions);
        }
      }
    }

    super.willUpdate(_changedProperties);
  }
}
