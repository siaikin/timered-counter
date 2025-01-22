import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { PartData } from '../../types/group.js';
import { PartPreprocessedData } from '../../utils/preprocess-part-data.js';
import './roller-digit.js';
import { rollerStyles } from './styles.js';

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
                ></timered-counter-roller-digit>
              </span>`,
          )}</span
        >`,
    );
  }
}
