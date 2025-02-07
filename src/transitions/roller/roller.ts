import { html, LitElement, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { PartData } from '../../types/group.js';
import { PartPreprocessedData } from '../../utils/preprocess-part-data.js';
import './roller-digit.js';
import { rollerStyles } from './styles.js';

class RollerAnimationEvent extends Event {
  // constructor(type: string, eventInitDict?: EventInit) {
  //   super(type, eventInitDict);
  // }
}

@customElement('timered-counter-roller')
export class TimeredCounterRoller extends LitElement {
  static styles = [rollerStyles];

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

  protected render() {
    return repeat(
      this.parts,
      (_, index) => index,
      (part, partIndex) =>
        html`<span class="roller-part"
          >${repeat(
            part.digits,
            (_, index) => `${part.digits.length - index}`,
            (digitInfo, digitIndex) =>
              html`<span
                class="roller-part__wrapper"
                data-part-id="${partIndex}"
                data-digit-id="${digitIndex}"
              >
                <timered-counter-roller-digit
                  .digit=${digitInfo}
                  .preprocessData=${this.partPreprocessDataList[partIndex][
                    digitIndex
                  ]}
                  .direction=${this.direction}
                  .textStyle=${this.digitStyles[partIndex][digitIndex]}
                  .cellStyle=${this.cellStyles[partIndex][digitIndex]}
                  .animationOptions=${this.animationOptions[partIndex][
                    digitIndex
                  ]}
                  .keyframes=${this.keyframes[partIndex][digitIndex]}
                  @roller-digit-animation-end=${this.__handleDigitAnimationEnd}
                ></timered-counter-roller-digit>
              </span>`,
          )}</span
        >`,
    );
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
    this.dispatchEvent(new RollerAnimationEvent('roller-animation-start'));
  }

  private __emitAnimationEnd() {
    this.dispatchEvent(new RollerAnimationEvent('roller-animation-end'));
  }
}
