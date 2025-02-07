import { html, LitElement, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { isDeepEqual, isNumber, values, clone } from 'remeda';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { CounterStylesMixin } from './mixins/counter-styles.js';
import { CounterPartsMixin } from './mixins/counter-parts.js';
import { CounterBaseMixin } from './mixins/counter-base.js';
import { timeredCounterstyles } from './styles/timered-counter-styles.js';
import { CounterAnimationMixin } from './mixins/counter-animation.js';
import './transitions/roller/index.js';
import { CounterAiraMixin } from './mixins/counter-aira.js';
import { mergePartDigitOption } from './utils/extract-group-option.js';

class TimeredCounterAnimationEvent extends Event {
  // constructor(type: string, eventInitDict?: EventInit) {
  //   super(type, eventInitDict);
  // }
}

@customElement('timered-counter')
export class TimeredCounter extends CounterAiraMixin(
  CounterAnimationMixin(
    CounterStylesMixin(CounterPartsMixin(CounterBaseMixin(LitElement))),
  ),
) {
  static styles = [timeredCounterstyles];

  resizeObserver: ResizeObserver;

  @state()
  partsContainerRect: DOMRect | undefined;

  @query('.counter-parts')
  partsContainer: HTMLElement | undefined;

  @query('timered-counter-roller')
  partsAnimationContainer: HTMLElement | undefined;

  @query('.counter__prefix')
  prefixContainer: HTMLElement | undefined;

  @query('.counter__suffix')
  suffixContainer: HTMLElement | undefined;

  private cachedDigitStyles: Partial<CSSStyleDeclaration>[][] = [];

  extractDigitStyles(): Partial<CSSStyleDeclaration>[][] {
    const styles = super.extractDigitStyles();

    this.__updatePartDigitsColorStyles();
    const colorStyles = this.__partDigitsColorStyles;

    const newStyles = mergePartDigitOption(clone(styles), colorStyles);

    if (!isDeepEqual(this.cachedDigitStyles, newStyles)) {
      this.cachedDigitStyles = newStyles;
    }

    return this.cachedDigitStyles;
  }

  constructor() {
    super();

    this.resizeObserver = new ResizeObserver(() => {
      this.partsContainerRect = this.partsContainer
        ? this.partsContainer.getBoundingClientRect()
        : new DOMRect();
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (this.partsContainer) {
      this.resizeObserver.observe(this.partsContainer);
    }
  }

  render() {
    const cellStyles = this.extractCellStyles();
    const digitStyles = this.extractDigitStyles();
    const partStyles = this.extractPartStyles();

    const animationOptions = this.extractAnimationOptions();
    const keyframes = this.extractKeyframes();

    return html`<span class="timered-counter" aria-hidden="true">
      <span
        class="counter__prefix"
        data-part-id="-1"
        data-digit-id="0"
        style=${styleMap(
          (this.__partDigitsColorStyles[-1]?.[0] ?? {}) as StyleInfo,
        )}
      >
        <slot name="prefix"></slot>
      </span>
      <span class="counter-parts">
        <timered-counter-roller
          .parts=${this.parts}
          .partPreprocessDataList=${this.partPreprocessDataList}
          .animationOptions=${animationOptions}
          .keyframes=${keyframes}
          .cellStyles=${cellStyles}
          .digitStyles=${digitStyles}
          .partStyles=${partStyles}
          .direction=${this.direction}
          @roller-animation-start=${this.__emitTimeredCounterAnimationStart}
          @roller-animation-end=${this.__emitTimeredCounterAnimationEnd}
        ></timered-counter-roller>
      </span>
      <span
        class="counter__suffix"
        data-part-id="-2"
        data-digit-id="0"
        style=${styleMap(
          (this.__partDigitsColorStyles[-2]?.[0] ?? {}) as StyleInfo,
        )}
      >
        <slot name="suffix"></slot>
      </span>
    </span>`;
  }

  private __partDigitsColorStyles: Partial<CSSStyleDeclaration>[][] = [];

  private __updatePartDigitsColorStyles() {
    const result: Partial<CSSStyleDeclaration>[][] = [];

    const container = this.partsContainer;
    const containerRect = this.partsContainerRect;
    const {
      // parts,
      // oldParts,
      prefixContainer,
      suffixContainer,
      color,
    } = this;
    const partDigitElements = Array.from(
      this.partsAnimationContainer?.shadowRoot
        ?.querySelectorAll('[data-part-id]')
        .values() ?? [],
    ) as HTMLElement[];

    /**
     * 当某次更新**将**会导致 DOM 宽高发生变化时(如: 滚动数字的位数增加/减少会导致宽度变化),
     * 需要跳过这次更新然后等待 DOM 宽高变化完成才能更新(宽高变化后将通过 {@link containerRect} 触发).
     */
    if (!container || !containerRect) {
      return;
    }
    /**
     * 比较 {@link data} 前后不同判断是否导致 DOM 宽度会发生变化.
     */
    // if (parts.length !== oldParts.length) {
    //   this.requestUpdate();
    //   return result;
    // }
    // for (let i = 0; i < parts.length; i++) {
    //   if (parts[i].digits.length !== oldParts[i].digits.length) {
    //     this.requestUpdate();
    //     return result;
    //   }
    // }

    if (prefixContainer) partDigitElements[-1] = prefixContainer;
    if (suffixContainer) partDigitElements[-2] = suffixContainer;

    for (const el of values(partDigitElements)) {
      const partId = Number.parseInt(el.dataset.partId ?? '-1', 10);
      const digitId = Number.parseInt(el.dataset.digitId ?? '-1', 10);
      if (!isNumber(partId) || !isNumber(digitId)) {
        throw new Error(
          'The data-part-id and data-digit-id attributes are required.',
        );
      }

      if (!result[partId]) result[partId] = [];

      if (CSS.supports('color', color)) {
        result[partId][digitId] = { color };
      } else if (CSS.supports('background-image', color)) {
        result[partId][digitId] = {
          backgroundImage: color,
          backgroundClip: 'text',
          backgroundSize: `${container.offsetWidth}px ${container.offsetHeight}px`,
          backgroundPositionX: `${-el.offsetLeft}px`,
          backgroundPositionY: `${-el.offsetTop}px`,
          backgroundRepeat: 'no-repeat',
          color: 'transparent',
          // @ts-ignore
          '-webkit-text-fill-color': 'transparent',
        };
      } else {
        result[partId][digitId] = {};
        // todo error event
        // eslint-disable-next-line no-console
        console.warn(new Error('The color property is not supported.'));
      }
    }

    this.__partDigitsColorStyles = result;
  }

  private __emitTimeredCounterAnimationStart() {
    this.dispatchEvent(
      new TimeredCounterAnimationEvent('timered-counter-animation-start'),
    );
  }

  private __emitTimeredCounterAnimationEnd() {
    this.dispatchEvent(
      new TimeredCounterAnimationEvent('timered-counter-animation-end'),
    );
  }
}
