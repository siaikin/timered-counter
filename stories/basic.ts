import { StoryObj } from '@storybook/web-components';
import { range } from 'remeda';
import type { TimeredCounter } from '../src/index.js';
import { sleep, equal, setByProp, setByAttr } from './utils/index.js';

export const Basic: StoryObj<TimeredCounter> = {
  args: {
    className: 'test-target',
    value: 0,
    animationOptions: {
      duration: 100,
    },
  },
  async play({ canvasElement, step }) {
    const counter = canvasElement.querySelector(
      '.test-target',
    ) as TimeredCounter;

    const list = range(0, 2).map(v => v * 10);

    async function test(setBy: typeof setByAttr | typeof setByProp) {
      await step('Incrementing the value', async () => {
        for await (const value of list) {
          setBy(counter, 'value', value.toString());
          await sleep(110);
          await equal(counter, counter.value, value);
        }
      });

      await step('Decrementing the value', async () => {
        for await (const value of list.reverse()) {
          setBy(counter, 'value', value.toString());
          await sleep(110);
          await equal(counter, counter.value, value);
        }
      });

      await step('Edge case', async () => {
        // value 为空
        await step('Setting the value to an empty string', async () => {
          setBy(counter, 'value', '');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为非数字
        await step('Setting the value to a non-number', async () => {
          setBy(counter, 'value', 'a');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为小数
        await step('Setting the value to a decimal number', async () => {
          setBy(counter, 'value', '1.1');
          await sleep(110);
          await equal(counter, counter.value, 1.1);
        });

        // value 为负数
        await step('Setting the value to a negative number', async () => {
          setBy(counter, 'value', '-1');
          await sleep(110);
          await equal(counter, counter.value, -1);
        });

        // value 为 Infinity
        await step('Setting the value to Infinity', async () => {
          setBy(counter, 'value', 'Infinity');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 NaN
        await step('Setting the value to NaN', async () => {
          setBy(counter, 'value', 'NaN');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 null
        await step('Setting the value to null', async () => {
          setBy(counter, 'value', 'null');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 undefined
        await step('Setting the value to undefined', async () => {
          setBy(counter, 'value', 'undefined');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 true
        await step('Setting the value to true', async () => {
          setBy(counter, 'value', 'true');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 false
        await step('Setting the value to false', async () => {
          setBy(counter, 'value', 'false');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为对象
        await step('Setting the value to an object', async () => {
          setBy(counter, 'value', '{}');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为数组
        await step('Setting the value to an array', async () => {
          setBy(counter, 'value', '[]');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为函数
        await step('Setting the value to a function', async () => {
          setBy(counter, 'value', '() => {}');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 Symbol
        await step('Setting the value to a Symbol', async () => {
          setBy(counter, 'value', 'Symbol()');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });

        // value 为 BigInt
        await step('Setting the value to a BigInt', async () => {
          setBy(counter, 'value', 'BigInt(1)');
          await sleep(110);
          await equal(counter, counter.value, 0);
        });
      });
    }

    await step('Testing with attribute', () => test(setByAttr));
    await step('Testing with property', () => test(setByProp));
  },
};
