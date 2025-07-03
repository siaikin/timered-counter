import { html, LitElement, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { property, query } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { isNumber, values } from 'remeda';
import { PartData } from '../../types/group.js';
import { PartPreprocessedData } from '../../utils/preprocess-part-data.js';
import './roller-digit.js';
import { rollerStyles } from './styles.js';
import { graceDefineCustomElement } from '../../utils/grace-define-custom-element.js';

class RollerAnimationEvent extends Event {
  // constructor(type: string, eventInitDict?: EventInit) {
  //   super(type, eventInitDict);
  // }
}

export class TimeredCounterRoller extends LitElement {
  static styles = [rollerStyles];

  @property({ type: String })
  color: string = '';

  @property({ type: String })
  direction: 'up' | 'down' = 'up';

  @property({ type: Array })
  parts: PartData[] = [];

  @property({ type: Array })
  partPreprocessDataList: PartPreprocessedData[][] = [];

  @property({ type: Array })
  animationOptions: KeyframeAnimationOptions[][] = [];

  @property({ type: Array })
  keyframes: PropertyIndexedKeyframes[][] = [];

  @property({ type: Array })
  cellStyles: Partial<CSSStyleDeclaration>[][][] = [];

  @property({ type: Array })
  digitStyles: Partial<CSSStyleDeclaration>[][] = [];

  @property({ type: Array })
  partStyles: Partial<CSSStyleDeclaration>[] = [];

  @property({ type: Object })
  parentContainerRect: DOMRect = {} as DOMRect;

  @query('.roller__prefix')
  prefixContainer: HTMLElement | undefined;

  @query('.roller__suffix')
  suffixContainer: HTMLElement | undefined;

  private __partDigitsColorStyles: Partial<CSSStyleDeclaration>[][] = [];

  protected render() {
    return html`<span
        class="roller__prefix"
        data-part-id="-1"
        data-digit-id="0"
        style=${styleMap(
          (this.__partDigitsColorStyles?.[-1]?.[0] ?? {}) as StyleInfo,
        )}
      >
        <slot part="prefix" name="prefix"></slot>
      </span>
      <span class="counter-parts">
        ${repeat(
          this.parts,
          (_, index) => index,
          (part, partIndex) =>
            html`<span
              part="part"
              class="roller-part"
              style=${styleMap(
                (this.partStyles?.[partIndex] ?? {}) as StyleInfo,
              )}
              >${repeat(
                part.digits,
                (_, index) => `${part.digits.length - index}`,
                (digitInfo, digitIndex) =>
                  html`<timered-counter-roller-digit
                    exportparts="digit, cell"
                    part="digit"
                    class="roller-part__wrapper"
                    style=${styleMap(
                      (this.digitStyles?.[partIndex]?.[digitIndex] ??
                        {}) as StyleInfo,
                    )}
                    data-part-id="${partIndex}"
                    data-digit-id="${digitIndex}"
                    .digit=${digitInfo}
                    .preprocessData=${this.partPreprocessDataList[partIndex][
                      digitIndex
                    ]}
                    .direction=${this.direction}
                    .textStyle=${this.__partDigitsColorStyles?.[partIndex]?.[
                      digitIndex
                    ] ?? {}}
                    .cellStyle=${this.cellStyles[partIndex][digitIndex]}
                    .animationOptions=${this.animationOptions[partIndex][
                      digitIndex
                    ]}
                    .keyframes=${this.keyframes[partIndex][digitIndex]}
                    @roller-digit-animation-end=${this
                      .__handleDigitAnimationEnd}
                  ></timered-counter-roller-digit>`,
              )}${html`<span
                class="roller-part__suffix"
                data-part-id="${partIndex}"
                data-digit-id="-1"
                style=${styleMap(
                  (this.__partDigitsColorStyles?.[partIndex]?.[-1] ??
                    {}) as StyleInfo,
                )}
                ><slot
                  part="part-suffix"
                  name=${`part-suffix-${partIndex}`}
                ></slot
              ></span>`}</span
            > `,
        )}</span
      ><span
        class="roller__suffix"
        data-part-id="-2"
        data-digit-id="0"
        style=${styleMap(
          (this.__partDigitsColorStyles?.[-2]?.[0] ?? {}) as StyleInfo,
        )}
        ><slot part="suffix" name="suffix"></slot
      ></span>`;
  }

  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    if (
      _changedProperties.has('direction') ||
      _changedProperties.has('parts')
    ) {
      this.digitAnimateEndCount = 0;
      this.digitAnimatedCount = this.partPreprocessDataList
        .flat()
        .filter(({ animate }) => animate).length;

      if (this.digitAnimatedCount > 0) {
        this.__emitAnimationStart();
      }
    }

    this.__partDigitsColorStyles = this.__generatePartDigitsColorStyles();
  }

  /**
   * 记录一次更新中, 启动动画并结束的 <timered-counter-roller-digit> 元素个数.
   *
   * 在每次更新前重置为 0.
   *
   * @see {@link __handleDigitAnimationEnd}
   * @private
   */
  private digitAnimateEndCount = 0;

  /**
   * 记录一次更新中, 需要启动动画的 <timered-counter-roller-digit> 元素总数.
   *
   * 在每次更新前重新计算.
   * @private
   */
  private digitAnimatedCount = 0;

  private __handleDigitAnimationEnd() {
    this.digitAnimateEndCount++;

    if (this.digitAnimateEndCount < this.digitAnimatedCount) return;

    this.__emitAnimationEnd();
  }

  private __emitAnimationStart() {
    if (!this.isConnected) return;

    this.dispatchEvent(new RollerAnimationEvent('roller-animation-start'));
  }

  private __emitAnimationEnd() {
    if (!this.isConnected) return;

    this.dispatchEvent(new RollerAnimationEvent('roller-animation-end'));
  }

  private __generatePartDigitsColorStyles() {
    const result: Partial<CSSStyleDeclaration>[][] = [];

    const containerRect = this.parentContainerRect;
    const {
      // parts,
      // oldParts,
      prefixContainer,
      suffixContainer,
      color,
    } = this;
    const partDigitElements = Array.from(
      this.shadowRoot?.querySelectorAll('[data-part-id]').values() ?? [],
    ) as HTMLElement[];

    /**
     * 当某次更新**将**会导致 DOM 宽高发生变化时(如: 滚动数字的位数增加/减少会导致宽度变化),
     * 需要跳过这次更新然后等待 DOM 宽高变化完成才能更新(宽高变化后将通过 {@link containerRect} 触发).
     */
    if (!containerRect) {
      return result;
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
          backgroundSize: `${this.offsetWidth}px ${this.offsetHeight}px`,
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

    return result;
  }
}

graceDefineCustomElement('timered-counter-roller', TimeredCounterRoller);
