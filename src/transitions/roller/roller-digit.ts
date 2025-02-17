import { html, LitElement, PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import {
  intersection,
  isEmpty,
  isNullish,
  isString,
  merge,
  omit,
  range,
} from 'remeda';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { PartPreprocessedData } from '../../utils/preprocess-part-data.js';
import { PartDataDigit } from '../../types/group.js';
import { rollerDigitStyles } from './styles.js';
import * as EasingFunctions from '../../easing/index.js';

class RollerDigitAnimationEvent extends Event {
  // constructor(type: string, eventInitDict?: EventInit) {
  //   super(type, eventInitDict);
  // }
}

@customElement('timered-counter-roller-digit')
export class TimeredCounterRollerDigit extends LitElement {
  static styles = [rollerDigitStyles];

  @property({ type: Object })
  digit: PartDataDigit = { data: [], place: 0 };

  @property({ type: Object })
  preprocessData: PartPreprocessedData = {
    animate: true,
    cancelPrevAnimation: false,
    earlyReturn: '',
    index: 0,
    partIndex: 0,
    digitIndex: 0,
  };

  @property({ type: String })
  direction: 'up' | 'down' = 'up';

  @property({ type: Object })
  textStyle: Partial<CSSStyleDeclaration> = {};

  @property({ type: Array })
  cellStyle: Partial<CSSStyleDeclaration>[] = [];

  @property({ type: Object })
  animationOptions: KeyframeAnimationOptions = {};

  @property({ type: Object })
  keyframes: PropertyIndexedKeyframes = {};

  @query('.roll-list__shadow')
  clonedRollDigitList: HTMLElement | undefined;

  @query('.roll-list')
  rollList: HTMLElement | undefined;

  @state()
  digitWidth: number = 0;

  resizeObserver: ResizeObserver;

  animation: Animation | undefined;

  constructor() {
    super();

    this.resizeObserver = new ResizeObserver(() => {
      this.digitWidth = (
        this.clonedRollDigitList
          ? this.clonedRollDigitList.getBoundingClientRect()
          : new DOMRect()
      ).width;
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues<this>) {
    super.firstUpdated(_changedProperties);

    if (this.clonedRollDigitList) {
      this.resizeObserver.observe(this.clonedRollDigitList);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.resizeObserver.disconnect();
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    /**
     * 仅当影响滚动列表 dom 结构的属性发生变化时才会触发动画.
     */
    if (
      intersection(Array.from(_changedProperties.keys()), [
        'digit',
        'preprocessData',
        'direction',
        'animationOptions',
        'keyframes',
      ]).length > 0
    ) {
      if (this.shouldAnimate()) {
        this.startAnimation().then();
      }
    }
  }

  render() {
    const shadowCellStyle = this.cellStyle.map(style =>
      omit(style, ['position']),
    );

    return html`
      <span class="roller-part-digit">
        <!--    占位      -->
        <span
          class="placeholder"
          style=${styleMap({ width: `${Math.round(this.digitWidth)}px` })}
        >
          0
        </span>
        <!--  一个不可见的滚动列表的复制, 用于计算该列表的最大宽度.  -->
        <span class="roll-list__shadow">
          ${repeat(
            this.digit.data,
            (_, index) => index,
            (digit, index) => html`
              <span style=${styleMap(shadowCellStyle[index] as StyleInfo)}>
                ${digit}
              </span>
            `,
          )}
        </span>
        <span
          class=${classMap({
            /**
             * 向上(up)滚动时, 使滚动列表顶部对齐以便于应用 `translationY(-100%)` 实现向上滚动效果
             * 向下同理
             */
            'roll-list__up': this.direction === 'up',
            'roll-list__down': this.direction === 'down',
            'roll-list': true,
          })}
        >
          ${this.digit.data.length > 1
            ? repeat(
                this.digit.data,
                (_, index) => index,
                (digit, index) => {
                  if (
                    this.direction === 'up' &&
                    index === this.digit.data.length - 1
                  ) {
                    return html`<span
                      class="roll-item roll-item__head"
                      style=${styleMap(this.cellStyle[index] as StyleInfo)}
                    >
                      <span style=${styleMap(this.textStyle as StyleInfo)}
                        >${digit}</span
                      >
                    </span>`;
                  }
                  if (this.direction === 'down' && index === 0) {
                    return html`
                      <span
                        class="roll-item roll-item__tail"
                        style=${styleMap(this.cellStyle[index] as StyleInfo)}
                      >
                        <span style=${styleMap(this.textStyle as StyleInfo)}
                          >${digit}</span
                        >
                      </span>
                    `;
                  }
                  return html`
                    <span
                      class="roll-item"
                      style=${styleMap(this.cellStyle[index] as StyleInfo)}
                    >
                      <span style=${styleMap(this.textStyle as StyleInfo)}
                        >${digit}</span
                      >
                    </span>
                  `;
                },
              )
            : html`
                <span
                  class="roll-item"
                  style=${styleMap(this.cellStyle[0] as StyleInfo)}
                >
                  <span style=${styleMap(this.textStyle as StyleInfo)}
                    >${this.digit.data[0]}</span
                  >
                </span>
              `}
        </span>
      </span>
    `;
  }

  shouldAnimate() {
    const { cancelPrevAnimation, animate } = this.preprocessData;
    if (cancelPrevAnimation) {
      if (this.animation) {
        this.animation.cancel();
      }

      if (this.rollList && this.rollList.style && this.rollList.style.cssText) {
        this.rollList.style.cssText = '';
      }
    }

    if (!animate) return false;

    return true;
  }

  async startAnimation() {
    if (isNullish(this.rollList)) return;

    this.__emitAnimationStart();

    const anmOptions = merge(
      { duration: 1000, iterations: 1, easing: 'ease-out', fill: 'forwards' },
      this.animationOptions,
    );

    const keyframes = isEmpty(this.keyframes)
      ? {
          up: { transform: ['translateY(0)', 'translateY(-100%)'] },
          down: { transform: ['translateY(0)', 'translateY(100%)'] },
        }[this.direction]
      : this.keyframes;

    /**
     * 尝试从 `PennerEasingFunctions` 中获取对应的 easing 函数
     */
    // {
    if (
      isString(anmOptions.easing) &&
      EasingFunctions[anmOptions.easing as keyof typeof EasingFunctions]
    ) {
      const func =
        EasingFunctions[anmOptions.easing as keyof typeof EasingFunctions];
      anmOptions.easing = `linear(${range(0, 64)
        .map((_, i) => func(i / 63))
        .join(',')})`;
    }
    // }

    try {
      this.clearAnimation();
      this.animation = this.rollList.animate(keyframes, anmOptions);

      this.animation.addEventListener(
        'finish',
        () => this.__emitAnimationEnd(),
        {
          once: true,
        },
      );

      // /**
      //  * 动画播放完成或被其他动画中断都会使得 `finished` resolve.
      //  * 只有当动画顺利播放完成的情况下, 才能调用 `cancel` 取消动画. 在其他情况下调用, 会抛出异常[1].
      //  *
      //  * 因此, 提前检查 `playState` 的值. 当 `playState` 不是 `finished` 时, 说明动画被其他 `Animation` 实例中断.
      //  * 因为已经有其他 `Animation` 实例的存在, 我们可以直接丢弃这个 `Animation` 实例, 而不用担心无动画可用.
      //  *
      //  * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel#exceptions
      //  */
      // await this.animation.finished;
      // if (
      //   this.animation.playState === 'finished' &&
      //   this.rollList.checkVisibility()
      // ) {
      //   // this.animation.commitStyles();
      //   // this.animation.cancel();
      // }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  clearAnimation() {
    this.animation?.removeEventListener('finish', this.__emitAnimationEnd);
    this.animation?.cancel();
  }

  private __emitAnimationStart() {
    this.dispatchEvent(
      new RollerDigitAnimationEvent('roller-digit-animation-start'),
    );
  }

  private __emitAnimationEnd() {
    this.dispatchEvent(
      new RollerDigitAnimationEvent('roller-digit-animation-end'),
    );
  }
}
