import { customElement, property } from 'lit/decorators.js';
import './transitions/roller/index.js';
import { html, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { isArray, isDate, isNullish, isString, map } from 'remeda';
import { isValid, toDate } from 'date-fns';
import { TimeredCounter } from './timered-counter.js';
import { AvailableNumberAdapterValueType } from './number-adapter/index.js';
import { DurationPartMillisecond, DurationPartType } from './types/duration.js';
import { getLocalizedDateTimeFields } from './utils/localized-date-time-fields.js';
import { duration, durationObject } from './utils/duration.js';
import { iso8601Duration } from './utils/iso8601-duration.js';
import { timeredCounterDatetimeStyles } from './styles/timered-counter-datetime-styles.js';
import { parseJsonString } from './utils/parse-json-string.js';

/**
 * 根据最小精度对 from 进行优化. 避免频繁更新.
 *
 * 1. from 先会被减小到 minPrecisionMs 的整数倍.
 * 2. 如果 from 和 to 的差值不是 minPrecisionMs 的整数倍, 则再加上/减去一个 minPrecisionMs 的值. 加上或减去取决于 from 和 to 的谁更大.
 *    这相当于将 from 中小于 minPrecisionMs 的值舍入到 minPrecisionMs 的整数倍.
 * 3. 加上 to 余 minPrecisionMs 的值, 保证 from 与 to 的差值是 minPrecisionMs 的整数倍.
 */
function optimizeFrom(from: Date, to: Date, minPrecision: DurationPartType) {
  const minPrecisionMs = DurationPartMillisecond[minPrecision];
  const fromTS = from.getTime();
  const toTS = to.getTime();

  const base = fromTS - (fromTS % minPrecisionMs);
  const offset = Math.abs(toTS - fromTS) % minPrecisionMs;

  return (
    base +
    (offset > 0 ? (fromTS < toTS ? -1 : 1) * minPrecisionMs : 0) +
    // 加上 deadlineDate 的余数, 消除精度误差.
    (toTS % minPrecisionMs)
  );
}

@customElement('timered-counter-datetime-duration')
export class TimeredCounterDatetimeDuration extends TimeredCounter {
  static styles = [...TimeredCounter.styles, timeredCounterDatetimeStyles];

  private __precision: DurationPartType | [DurationPartType, DurationPartType] =
    [DurationPartType.Second, DurationPartType.Day];

  /**
   * 计数器显示的精度.
   * 1. 当为单个值时, 表示最小精度.
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
  }

  get value() {
    return super.value;
  }

  /**
   * 通过 property 设置 value 时, 支持 Date 类型.
   */
  set value(value: any) {
    if (isString(value)) value = parseJsonString(value);

    if (!isArray(value)) value = [value, value];

    this.__from = isDate(value[0]) ? value[0] : toDate(value[0]);
    this.__to = isDate(value[1]) ? value[1] : toDate(value[1]);
    if (!isValid(this.__from) || !isValid(this.__to)) {
      throw new Error(`value ${value[0]} or ${value[1]} is not a valid date.`);
    }

    this.__durationInMilliseconds = Math.abs(
      this.__to.getTime() -
        optimizeFrom(this.__from, this.__to, this.__minPrecision),
    );

    super.value = this.__durationInMilliseconds;
  }

  private __from: Date = new Date();

  private __to: Date = new Date();

  private __durationInMilliseconds = 0;

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
        new Date(Math.min(this.__durationInMilliseconds, 0)),
        new Date(Math.max(this.__durationInMilliseconds, 0)),
        map(this.__availableDurationParts, part => part.type),
      ),
    );
  }

  override connectedCallback() {
    super.connectedCallback();

    this.role = 'timer';
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
        exportparts="prefix, suffix, part-suffix"
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
            html`<span slot=${`part-suffix-${partIndex}`} class="duration-unit"
              >${this.__dateTimeFieldLabels[
                availableDurationPartTypes[partIndex]
              ]}</span
            >`,
        )}
      </timered-counter-roller>
    `;
  }

  override willUpdate(_changedProperties: PropertyValues) {
    /**
     * precision 相关属性的更新需要在 super.willUpdate 之前进行, 以便在 super.willUpdate 中使用到.
     *
     * __availableDurationParts 在 sampleSplit 中使用到, 而 sampleSplit 又会在 super.willUpdate 中使用(准确来说是 `CounterPartsMixinClass`).
     * 所以需要在 super.willUpdate 之前更新.
     */
    if (_changedProperties.has('precision')) {
      this.__minPrecision = isArray(this.precision)
        ? this.precision[0]
        : this.precision;
      this.__maxPrecision = isArray(this.precision)
        ? this.precision[1]
        : this.precision;

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

    super.willUpdate(_changedProperties);

    if (_changedProperties.has('locale')) {
      this.__dateTimeFieldLabels = getLocalizedDateTimeFields(
        this.localeInstance,
      );
    }
  }
}
