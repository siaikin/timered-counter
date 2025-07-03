import { property } from 'lit/decorators.js';
import { html, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { isArray, isDate, isNullish, isString, map } from 'remeda';
import { isValid, toDate, isBefore } from 'date-fns';
import { TimeredCounter } from './timered-counter.js';
import { AvailableNumberAdapterValueType } from './number-adapter/index.js';
import { DurationPartMillisecond, DurationPartType } from './types/duration.js';
import { getLocalizedDateTimeFields } from './utils/localized-date-time-fields.js';
import { duration, durationObject } from './utils/duration.js';
import { iso8601Duration } from './utils/iso8601-duration.js';
import { timeredCounterDatetimeStyles } from './styles/timered-counter-datetime-styles.js';
import { parseJsonString } from './utils/parse-json-string.js';
import { PartsOptions } from './mixins/counter-parts.js';
import { graceDefineCustomElement } from './utils/grace-define-custom-element.js';

/**
 * 根据最小精度对 from 进行优化. 避免频繁更新.
 *
 * 1. from 先会被减小到 minPrecisionMs 的整数倍.
 * 2. 加上 to 余 minPrecisionMs 的值, 保证 from 与 to 的差值是 minPrecisionMs 的整数倍.
 */
function optimizeFrom(from: Date, to: Date, minPrecision: DurationPartType) {
  const minPrecisionMs = DurationPartMillisecond[minPrecision];
  const fromTS = from.getTime();
  const toTS = to.getTime();

  const base = fromTS - (fromTS % minPrecisionMs);

  return base + (toTS % minPrecisionMs);
}

function toDurationInMilliseconds(value: any, minPrecision: DurationPartType) {
  if (isString(value)) value = parseJsonString(value);

  if (!isArray(value)) value = [value, value];

  const result = [
    isDate(value[0]) ? value[0] : toDate(value[0]),
    isDate(value[1]) ? value[1] : toDate(value[1]),
  ] as const;

  if (!isValid(result[0]) || !isValid(result[1])) {
    throw new Error(`value ${value[0]} or ${value[1]} is not a valid date.`);
  }

  const durationInMilliseconds = Math.abs(
    result[1].getTime() - optimizeFrom(result[0], result[1], minPrecision),
  );

  return {
    durationInMilliseconds,
    from: result[0],
    to: result[1],
  };
}

export class TimeredCounterDatetimeDuration extends TimeredCounter {
  static styles = [...TimeredCounter.styles, timeredCounterDatetimeStyles];

  private __precision: DurationPartType | [DurationPartType, DurationPartType] =
    [DurationPartType.Second, DurationPartType.Day];

  /**
   * 计数器显示的精度.
   * 1. 当为单个值时, 仅显示该精度的时间部分.
   * 2. 当为数组时, 第一个值表示最小精度, 第二个值表示最大精度.
   *
   * @default [DurationPartType.Second, DurationPartType.Day]
   *
   * @example DurationPartType.Second 显示从年份到秒数的所有精度.
   * @example [DurationPartType.Second, DurationPartType.Day] 显示从天数到秒数的所有精度.
   * @example [DurationPartType.Millisecond, DurationPartType.Year] 显示从年份到毫秒的所有精度.
   */
  @property({
    reflect: true,
    converter: value => {
      if (isNullish(value)) return value;

      return parseJsonString(value);
    },
  })
  get precision() {
    return this.__precision;
  }

  set precision(value: any) {
    if (isString(value)) value = parseJsonString(value);

    this.__precision = value;

    /**
     * `precision` 相关属性的更新需要立即更新, 以便于在 `value`, `initialValue` 等属性的 setter 中使用.
     */
    this.__minPrecision = isArray(this.__precision)
      ? this.__precision[0]
      : this.__precision;
    this.__maxPrecision = isArray(this.__precision)
      ? this.__precision[1]
      : this.__precision;

    this.__availableDurationParts = Object.values(DurationPartType)
      .reverse()
      .map(type => {
        const minPrecisionBreakpoint =
          DurationPartMillisecond[this.__minPrecision];
        const maxPrecisionBreakpoint =
          DurationPartMillisecond[this.__maxPrecision];
        const partMilliseconds = DurationPartMillisecond[type];
        return {
          type,
          available:
            partMilliseconds >= minPrecisionBreakpoint &&
            partMilliseconds <= maxPrecisionBreakpoint,
        };
      })
      .filter(part => part.available);
  }

  get value() {
    return super.value;
  }

  /**
   * 通过 property 设置 value 时, 支持 Date 类型.
   */
  set value(value: any) {
    const { from, to, durationInMilliseconds } = toDurationInMilliseconds(
      value,
      this.__minPrecision,
    );

    this.__from = from;
    this.__to = to;
    super.value = durationInMilliseconds;
  }

  private __initialValuePlain: any = null;

  get initialValue() {
    return super.initialValue;
  }

  /**
   * 同 value
   */
  set initialValue(value: any) {
    this.__initialValuePlain = value;

    const { durationInMilliseconds } = toDurationInMilliseconds(
      value,
      this.__minPrecision,
    );
    super.initialValue = durationInMilliseconds;
  }

  private __partsOptions: Partial<PartsOptions> | null = null;

  get partsOptions(): Partial<PartsOptions> {
    return super.partsOptions;
  }

  set partsOptions(value: Partial<PartsOptions>) {
    this.__partsOptions = value;
    super.partsOptions = {
      minPlaces: [2, undefined],
      ...this.__partsOptions,
    };
  }

  private __from: Date = new Date();

  private __to: Date = new Date();

  private __minPrecision: DurationPartType = DurationPartType.Second;

  private __maxPrecision: DurationPartType = DurationPartType.Day;

  private __availableDurationParts = [] as {
    type: DurationPartType;
    available: boolean;
  }[];

  private __dateTimeFieldLabels = {} as Record<DurationPartType, string>;

  override sampleSplit(
    samples: AvailableNumberAdapterValueType[],
  ): AvailableNumberAdapterValueType[][] {
    const availableDurationPartTypes = map(
      this.__availableDurationParts,
      part => part.type,
    );

    const tempParts = availableDurationPartTypes.map(() => [] as number[]);
    for (const n of samples) {
      const num = this.numberAdapter.toNumber(n);
      /**
       * 计算并保存每个在 {@link precision} 范围内的时间部分的值
       */
      const availablePartValues = duration(
        new Date(Math.min(num, 0)),
        new Date(Math.max(num, 0)),
        availableDurationPartTypes,
      );
      availablePartValues.forEach((value, i) => tempParts[i].push(value));
    }

    return tempParts;
  }

  override generateAriaLabel(): string {
    return iso8601Duration(
      durationObject(
        isBefore(this.__from, this.__to) ? this.__from : this.__to,
        isBefore(this.__from, this.__to) ? this.__to : this.__from,
        map(this.__availableDurationParts, part => part.type),
      ),
    );
  }

  override connectedCallback() {
    this.role = 'timer';

    /**
     * TimeredCounterDatetimeDuration 将 `minPlaces` 默认设置为 `[2]`. 实例化时需要手动触发 `partsOptions` 的 setter.
     */
    this.partsOptions = this.__partsOptions ?? {};

    this.initialValue = this.__initialValuePlain;

    /**
     * 类似上方的 partsOptions, precision 也需要在初始化时手动触发 setter. 以此确保 __minPrecision, __maxPrecision, __availableDurationParts 有值.
     */
    this.precision = this.__precision;

    super.connectedCallback();
  }

  override shouldRebuildParts(
    changedProperties: PropertyValues<this>,
  ): boolean {
    return (
      super.shouldRebuildParts(changedProperties) ||
      changedProperties.has('precision')
    );
  }

  override willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has('locale')) {
      this.__dateTimeFieldLabels = getLocalizedDateTimeFields(
        this.localeInstance,
      );
    }
  }

  override render() {
    const cellStyles = this.extractCellStyles();
    const digitStyles = this.extractDigitStyles();
    const partStyles = this.extractPartStyles();

    const animationOptions = this.extractAnimationOptions();
    const keyframes = this.extractKeyframes();

    const availableDurationPartTypes = map(
      this.__availableDurationParts,
      part => part.type,
    );

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
        ><slot name="prefix" slot="prefix"></slot
        ><slot name="suffix" slot="suffix"></slot>${repeat(
          this.parts,
          (_, index) => index,
          (_, partIndex) =>
            html`<span slot=${`part-suffix-${partIndex}`} class="duration-unit"
              >${this.__dateTimeFieldLabels[
                availableDurationPartTypes[partIndex]
              ]}</span
            >`,
        )}
      </timered-counter-roller>
    `;
  }
}

graceDefineCustomElement(
  'timered-counter-datetime-duration',
  TimeredCounterDatetimeDuration,
);
