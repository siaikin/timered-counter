import { StringAdapter } from "./types.js";

/**
 * 使用内置的 `Intl.Segmenter` 将字符串转换为字符数组.
 *
 * 要使用 {@link BuildInIntlSegmenterAdapter} 需要浏览器支持 `Intl.Segmenter`, 查看 [caniuse](https://caniuse.com/?search=Segmenter).
 *
 * @param locales 本地化配置. 用于创建 {@link Intl.Segmenter} 实例.
 */
const BuildInIntlSegmenterAdapter: (
  locales?: Intl.LocalesArgument
) => StringAdapter = (locales) => {
  const segmenter = new Intl.Segmenter(locales, { granularity: "grapheme" });

  return {
    stringToChars(value: string): string[] {
      const segments = Array.from(segmenter.segment(value));
      return segments.map((s) => s.segment);
    },
  };
};

export { BuildInIntlSegmenterAdapter };
