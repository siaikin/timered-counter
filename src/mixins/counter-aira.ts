import { Constructor } from 'type-fest';
import { property } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { CounterPartsMixin } from './counter-parts.js';
import { AvailableNumberAdapterValueType } from '../number-adapter/index.js';

export declare class CounterAiraMixinInterface {}

export const CounterAiraMixin = <
  V extends AvailableNumberAdapterValueType,
  T extends ReturnType<typeof CounterPartsMixin<V>> = ReturnType<
    typeof CounterPartsMixin<V>
  >,
>(
  superClass: T,
) => {
  class CounterAiraMixinClass extends superClass {
    @property({ attribute: 'aira-label', reflect: true })
    ariaLabel: string = '';

    @property({ attribute: 'aira-live', reflect: true })
    ariaLive: 'off' | 'polite' | 'assertive' = 'polite';

    generateAriaLabel(): string {
      return this.numberAdapter.toString(this.value);
    }

    willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (changedProperties.has('value')) {
        this.ariaLabel = this.generateAriaLabel();
      }
    }
  }

  return CounterAiraMixinClass as Constructor<CounterAiraMixinInterface> & T;
};
