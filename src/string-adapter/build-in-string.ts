import { StringAdapter } from "./types.js";

/**
 * 默认的字符串适配器. 该适配器使用内置的 `Array.from` 方法将字符串转换为字符数组.
 * 该方法可以正确处理包含单个的 emoji 字符的字符串[1]. 但对于由多个字符组合而成的 emoji 无能为力[2].
 *
 * 要支持组合的 emoji 查看 {@link BuildInIntlSegmenterAdapter}, {@link GraphemeSplitterAdapter}.
 *
 * [1]: https://dev.to/acanimal/how-to-slice-or-get-symbols-from-a-unicode-string-with-emojis-in-javascript-lets-learn-how-javascript-represent-strings-h3a
 * [2]: https://cestoliv.com/blog/how-to-count-emojis-with-javascript/
 */
const BuildInStringAdapter: () => StringAdapter = () => ({
  stringToChars(value: string): string[] {
    return Array.from(value);
  },
});

export { BuildInStringAdapter };
