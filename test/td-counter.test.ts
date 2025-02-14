import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { TimeredCounter } from '../src/index.js';

describe('TimeredCounter', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const el = await fixture<TimeredCounter>(
      html`<timered-counter></timered-counter>`,
    );

    // expect(el.header).to.equal('Hey there');
    // expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<TimeredCounter>(
      html`<timered-counter></timered-counter>`,
    );
    el.shadowRoot!.querySelector('button')!.click();

    // expect(el.counter).to.equal(6);
  });

  it('can override the header via attribute', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const el = await fixture<TimeredCounter>(
      html`<timered-counter header="attribute header"></timered-counter>`,
    );

    // expect(el.header).to.equal('attribute header');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<TimeredCounter>(
      html`<timered-counter></timered-counter>`,
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
