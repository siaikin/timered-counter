import GraphemeSplitter from 'grapheme-splitter';
import { StringAdapter } from './types.js';
import type { TimeredCounterAdapter } from '../timered-counter-adapter.js';

/**
 * 使用 `grapheme-splitter` 库的字符串适配器. 该适配器使用 `grapheme-splitter` 库将字符串转换为字符数组.
 *
 * 要使用 {@link GraphemeSplitterAdapter} 需要安装 `grapheme-splitter`.
 */
const GraphemeSplitterAdapter: () => StringAdapter = () => {
  const splitter = new GraphemeSplitter();

  return {
    stringToChars(value: string): string[] {
      return splitter.splitGraphemes(value);
    },
  };
};

export function register(counterAdapter: typeof TimeredCounterAdapter) {
  counterAdapter.registerStringAdapter(['grapheme-splitter'], () =>
    GraphemeSplitterAdapter(),
  );
}

export { GraphemeSplitterAdapter };

export default {
  register,
  GraphemeSplitterAdapter,
};
