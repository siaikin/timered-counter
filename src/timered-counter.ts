import { html, LitElement, PropertyValues } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { CounterStylesMixin } from './mixins/counter-styles.js';
import { CounterPartsMixin } from './mixins/counter-parts.js';
import { CounterBaseMixin } from './mixins/counter-base.js';
import { timeredCounterStyles } from './styles/timered-counter-styles.js';
import { CounterAnimationMixin } from './mixins/counter-animation.js';
import './transitions/roller/index.js';
import { CounterAiraMixin } from './mixins/counter-aira.js';
import { graceDefineCustomElement } from './utils/grace-define-custom-element.js';

class TimeredCounterAnimationEvent extends Event {
  // constructor(type: string, eventInitDict?: EventInit) {
  //   super(type, eventInitDict);
  // }
}

export class TimeredCounter extends CounterAiraMixin(
  CounterAnimationMixin(
    CounterStylesMixin(CounterPartsMixin(CounterBaseMixin(LitElement))),
  ),
) {
  static styles = [timeredCounterStyles];

  resizeObserver: ResizeObserver;

  @state()
  partsContainerRect: DOMRect | undefined;

  @query('timered-counter-roller')
  partsContainer: HTMLElement | undefined;

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

    return html`
      <timered-counter-roller
        exportparts="group, part, digit, cell, prefix, suffix, part-suffix"
        part="group"
        class="timered-counter"
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

  dispatchTimeredCounterAnimationStart() {
    this.dispatchEvent(
      new TimeredCounterAnimationEvent('timered-counter-animation-start'),
    );
  }

  dispatchTimeredCounterAnimationEnd() {
    this.dispatchEvent(
      new TimeredCounterAnimationEvent('timered-counter-animation-end'),
    );
  }
}

graceDefineCustomElement('timered-counter', TimeredCounter);
