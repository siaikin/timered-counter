import { html, LitElement, PropertyValues } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import { CounterStylesMixin } from './mixins/counter-styles.js';
import { CounterPartsMixin } from './mixins/counter-parts.js';
import { CounterBaseMixin } from './mixins/counter-base.js';
import { timeredCounterstyles } from './styles/timered-counter-styles.js';
import { CounterAnimationMixin } from './mixins/counter-animation.js';
import './transitions/roller/index.js';

@customElement('timered-counter')
export class TimeredCounter extends CounterAnimationMixin(
  CounterStylesMixin(CounterPartsMixin(CounterBaseMixin(LitElement))),
) {
  static styles = [timeredCounterstyles];

  resizeObserver: ResizeObserver;

  @state()
  partsContainerRect: DOMRect | undefined;

  @query('.counter-parts')
  partsContainer: HTMLElement | undefined;

  @queryAll('[data-part-id]')
  backgroundClippedPartDigitElements: NodeList | undefined;

  @query('.counter__prefix')
  prefixContainer: HTMLElement | undefined;

  @query('.counter__suffix')
  suffixContainer: HTMLElement | undefined;

  extractDigitStyles(): Partial<CSSStyleDeclaration>[][] {
    const styles = super.extractDigitStyles();
    const colorStyle = this.__generatePartDigitsColorStyle();

    return styles.map((partStyles, partIndex) =>
      partStyles.map((digitStyles, digitIndex) => ({
        ...digitStyles,
        ...colorStyle[partIndex]?.[digitIndex],
      })),
    );
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

    return html`<span class="timered-counter">
      <span class="counter__prefix">
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
        ></timered-counter-roller>
      </span>
      <span class="counter__suffix">
        <slot name="suffix"></slot>
      </span>
    </span>`;
  }

  private __generatePartDigitsColorStyle() {
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
      this.backgroundClippedPartDigitElements?.values() ?? [],
    ) as HTMLElement[];

    if (!container || !containerRect) {
      return result;
    }

    /**
     * 当某次更新**将**会导致 DOM 宽高发生变化时(如: 滚动数字的位数增加/减少会导致宽度变化),
     * 需要跳过这次更新然后等待 DOM 宽高变化完成才能更新(宽高变化后将通过 {@link containerRect} 触发).
     */
    // try {
    //   if (!containerValue || !containerRectValue) {
    //     return;
    //   }
    //   /**
    //    * 比较 {@link data} 前后不同判断是否导致 DOM 宽度会发生变化.
    //    */
    //   if (dataValue.length !== previousDataValue.length) {
    //     return;
    //   }
    //   for (let i = 0; i < dataValue.length; i++) {
    //     if (dataValue[i].digits.length !== previousDataValue[i].digits.length) {
    //       return;
    //     }
    //   }
    // } finally {
    //   previousData.value = data.value;
    // }

    if (prefixContainer) partDigitElements.unshift(prefixContainer);
    if (suffixContainer) partDigitElements.push(suffixContainer);

    for (const el of partDigitElements) {
      const partId = Number.parseInt(el.dataset.partId ?? '0', 10);
      const digitId = Number.parseInt(el.dataset.digitId ?? '0', 10);
      if (Number.isNaN(partId) || Number.isNaN(digitId)) {
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
        console.warn(new Error('The color property is not supported.'));
      }
    }

    return result;
  }
}
