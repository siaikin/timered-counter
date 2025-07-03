export function graceDefineCustomElement(
  tagName: string,
  constructor: CustomElementConstructor,
): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  if (customElements.get(tagName)) {
    return;
  }

  customElements.define(tagName, constructor);
}
