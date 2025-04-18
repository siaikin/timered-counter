import { expect } from '@storybook/test';
import { isString } from 'remeda';
import type { TimeredCounter } from '../../src/index.js';

export function equal(counter: TimeredCounter, a: any, b: any) {
  const na = counter.numberAdapter;
  return expect(na.toString(a)).toBe(na.toString(na.create(b)));
}

export function setByAttr(element: TimeredCounter, attr: string, value: any) {
  value = isString(value) ? value : value.toString();
  element.setAttribute(attr, value);
}

export function setByProp(element: TimeredCounter, prop: string, value: any) {
  // @ts-ignore
  element[prop] = value;
}

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export type NoUndefinedField<T> = { [P in keyof T]-?: T[P] };
