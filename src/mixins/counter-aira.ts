import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { CounterPartsMixin } from './counter-parts.js';
import { AvailableNumberAdapterValueType } from '../number-adapter/index.js';

export declare class CounterAiraMixinInterface {
  ariaLabel: string;

  ariaLive: 'off' | 'polite' | 'assertive';

  generateAriaLabel(): string;
}

export const CounterAiraMixin = <
  V extends AvailableNumberAdapterValueType,
  T extends ReturnType<typeof CounterPartsMixin<V>> = ReturnType<
    typeof CounterPartsMixin<V>
  >,
>(
  superClass: T,
) => {
  class CounterAiraMixinClass extends superClass {
    @property({ attribute: 'aria-label', reflect: true })
    ariaLabel: string = '';

    @property({ attribute: 'aira-live', reflect: true })
    ariaLive: 'off' | 'polite' | 'assertive' = 'polite';

    /**
     * 生成 aria-label 属性值. 在每次更新完成后调用.
     */
    generateAriaLabel(): string {
      let label = '';

      const { direction } = this;
      for (const part of this.parts) {
        for (const digit of part.digits) {
          label += `${digit.data[direction === 'up' ? digit.data.length - 1 : 0]}`;
        }
      }

      return label;
    }

    override willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      this.ariaLabel = this.generateAriaLabel();
    }

    // updated(changedProperties: PropertyValues<this>) {
    //   if (changedProperties.has('value')) {
    //     this.ariaLabel = this.generateAriaLabel();
    //   }
    // }
  }

  return CounterAiraMixinClass as Constructor<CounterAiraMixinInterface> & T;
};
