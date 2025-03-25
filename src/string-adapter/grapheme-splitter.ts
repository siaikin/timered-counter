// @ts-ignore
import GraphemeSplitter from 'grapheme-splitter';
import { StringAdapter } from './types.js';

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

export { GraphemeSplitterAdapter };
