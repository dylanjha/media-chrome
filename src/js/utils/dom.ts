const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export function defineCustomElement(
  name: string,
  element: CustomElementConstructor
) {
  if (!canUseDOM) {
    return;
  }

  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    (window as { [key: string]: any })[element.name] = element;
  }
}

export function createTemplateElement(): HTMLTemplateElement {
  if (!canUseDOM) {
    return {} as HTMLTemplateElement;
  }

  return document.createElement('template');
}

export const BaseElement = (canUseDOM
  ? HTMLElement
  : Object) as CustomElementConstructor;
