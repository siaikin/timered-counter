import { isNullish, isString } from 'remeda';
import { BuildInNumberAdapter, NumberAdapter } from './number-adapter/index.js';
import {
  BuildInIntlSegmenterAdapter,
  BuildInStringAdapter,
  StringAdapter,
} from './string-adapter/index.js';

export class TimeredCounterAdapter {
  static AVAILABLE_NUMBER_ADAPTERS: Map<string[], () => NumberAdapter> =
    new Map([
      [['number'], BuildInNumberAdapter],
      // [['decimal.js', 'decimaljs'], DecimalJsAdapter()],
    ]);

  static AVAILABLE_STRING_ADAPTERS: Map<string[], () => StringAdapter> =
    new Map([
      [['string'], BuildInStringAdapter],
      [['intl-segmenter'], BuildInIntlSegmenterAdapter],
      // [['grapheme-splitter'], GraphemeSplitterAdapter()],
    ]);

  /**
   * 数字适配器, 有以下两种:
   * 1. BuildInNumberAdapter(默认): 使用内置 number 进行计算.
   * 2. DecimalJsAdapter: 使用 Decimal.js 进行计算.
   *
   * 详细信息请查看[字符长度限制](/guide/optional-dependencies#字符长度限制)章节.
   *
   * @default BuildInNumberAdapter
   */
  static NUMBER_ADAPTER: NumberAdapter = BuildInNumberAdapter();

  /**
   * 字符串适配器, 有以下两种:
   * 1. BuildInStringAdapter(默认): 使用内置 string 进行字符串处理.
   * 2. BuildInIntlSegmenterAdapter: 使用 Intl.Segmenter 进行字符串处理. 能够支持 emoji, 字符集.
   * 3. GraphemeSplitterAdapter: 使用 grapheme-splitter 进行字符串处理. 能够支持 emoji, 字符集.
   *
   * 详细信息请查看[支持 emoji 分词](/guide/optional-dependencies#支持-emoji-分词)章节.
   *
   * @default BuildInStringAdapter
   */
  static STRING_ADAPTER: StringAdapter = BuildInStringAdapter();

  /**
   * 将 value 及其相关的属性, 在 attribute 和 property 上的互相转换.
   *
   * @see https://lit.dev/docs/components/properties/#attributes
   * @protected
   */
  static VALUE_CONVERTER = {
    fromAttribute(value: string | null) {
      return value;
    },
    toAttribute(value: unknown) {
      return isNullish(value)
        ? value
        : TimeredCounterAdapter.NUMBER_ADAPTER.toString(value);
    },
  };

  /**
   * 设置要使用的数字适配器. 仅对设置完之后的 TimeredCounter 实例生效.
   *
   * 接受的关键字除了内置的 `number` 以外, 还可以通过 {@link registerNumberAdapter} 注册的 `keyword`.
   *
   * @param adapterOrType
   */
  static setNumberAdapter(adapterOrType: NumberAdapter | 'number' | string) {
    let adapter: NumberAdapter = BuildInNumberAdapter();

    if (isString(adapterOrType)) {
      for (const [
        keywords,
        adapterFactory,
      ] of TimeredCounterAdapter.AVAILABLE_NUMBER_ADAPTERS) {
        if (keywords.includes(adapterOrType)) {
          adapter = adapterFactory();
          break;
        }
      }
    } else {
      adapter = adapterOrType;
    }

    TimeredCounterAdapter.NUMBER_ADAPTER = adapter;
  }

  /**
   * 与 {@link setNumberAdapter} 类似, 用于设置字符串适配器.
   */
  static setStringAdapter(
    adapterOrType: StringAdapter | 'string' | 'intl-segmenter' | string,
  ) {
    let adapter: StringAdapter = BuildInStringAdapter();

    if (isString(adapterOrType)) {
      for (const [
        keywords,
        adapterFactory,
      ] of TimeredCounterAdapter.AVAILABLE_STRING_ADAPTERS) {
        if (keywords.includes(adapterOrType)) {
          adapter = adapterFactory();
          break;
        }
      }
    } else {
      adapter = adapterOrType;
    }

    TimeredCounterAdapter.STRING_ADAPTER = adapter;
  }

  static registerNumberAdapter(
    keyword: string[],
    adapter: () => NumberAdapter,
  ) {
    TimeredCounterAdapter.AVAILABLE_NUMBER_ADAPTERS.set(keyword, adapter);
  }

  static registerStringAdapter(
    keyword: string[],
    adapter: () => StringAdapter,
  ) {
    TimeredCounterAdapter.AVAILABLE_STRING_ADAPTERS.set(keyword, adapter);
  }

  /**
   * 可以直接使用 adapter 文件的导出进行注册.
   *
   * adapter 文件需要导出一个名为 register 的函数, 该函数接受一个 TimeredCounterAdapter 类型的参数.
   *
   * 具体示例请查看 {@link GraphemeSplitterAdapter} or {@link DecimalJsAdapter}.
   */
  static registerAdapter(adapter: {
    register: (counterAdapter: typeof TimeredCounterAdapter) => void;
  }) {
    adapter.register(this);
  }
}

export function setNumberAdapter(
  ...args: Parameters<(typeof TimeredCounterAdapter)['setNumberAdapter']>
) {
  TimeredCounterAdapter.setNumberAdapter(...args);
}

export function setStringAdapter(
  ...args: Parameters<(typeof TimeredCounterAdapter)['setStringAdapter']>
) {
  TimeredCounterAdapter.setStringAdapter(...args);
}

export function registerNumberAdapter(
  ...args: Parameters<(typeof TimeredCounterAdapter)['registerNumberAdapter']>
) {
  TimeredCounterAdapter.registerNumberAdapter(...args);
}

export function registerStringAdapter(
  ...args: Parameters<(typeof TimeredCounterAdapter)['registerStringAdapter']>
) {
  TimeredCounterAdapter.registerStringAdapter(...args);
}

export function registerAdapter(
  ...args: Parameters<(typeof TimeredCounterAdapter)['registerAdapter']>
) {
  TimeredCounterAdapter.registerAdapter(...args);
}
