/**
 * 对于包含 emoji 字符的字符串, 不能通过 `split("")`, 数组索引等方式截取字符.
 *
 * 可以使用第三方库 `grapheme-splitter` 或 {@link Intl.Segmenter} API. 但其都有自身的限制.
 * 1. `grapheme-splitter` 要在项目中引入额外的文件大小.
 * 2. {@link Intl.Segmenter} API 较新, 在部分浏览器不支持.
 * 因此内部提供这两种方式的适配器, 根据需求选择.
 *
 *
 * @example "Hello" => ["H", "e", "l", "l", "o"]
 * @example "😀Hello" => ["😀", "H", "e", "l", "l", "o"]
 *
 * @see https://dev.to/acanimal/how-to-slice-or-get-symbols-from-a-unicode-string-with-emojis-in-javascript-lets-learn-how-javascript-represent-strings-h3a
 * @see https://mathiasbynens.be/notes/javascript-unicode
 * @see https://cestoliv.com/blog/how-to-count-emojis-with-javascript/
 * */
export interface StringAdapter {
  stringToChars(value: string): string[];

  /**
   * todo emoji 受到 color 样式的影响, 丢失原来的颜色, 看起来很不好.根据 isEmoji 决定是否应用 color 样式.
   * @param value
   */
  // isEmoji(value: string): boolean;
}
