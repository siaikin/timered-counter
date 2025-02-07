import { isNullish, isString } from 'remeda';
import { Decimal } from 'decimal.js';
import {
  BuildInNumberAdapter,
  DecimalJsAdapter,
  NumberAdapter,
} from './number-adapter/index.js';
import {
  BuildInIntlSegmenterAdapter,
  BuildInStringAdapter,
  GraphemeSplitterAdapter,
  StringAdapter,
} from './string-adapter/index.js';

export class CounterAdapter {
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
      return CounterAdapter.NUMBER_ADAPTER.create(isNullish(value) ? 0 : value);
    },
    toAttribute(value: unknown) {
      return CounterAdapter.NUMBER_ADAPTER.toString(value);
    },
  };

  static setNumberAdapter(
    adapterOrType: NumberAdapter | 'number' | 'decimal.js',
    config?: Decimal.Config,
  ) {
    let adapter: NumberAdapter = BuildInNumberAdapter();

    if (isString(adapterOrType)) {
      if (adapterOrType === 'number') adapter = BuildInNumberAdapter();
      else if (['decimal.js', 'decimaljs'].includes(adapterOrType))
        adapter = DecimalJsAdapter(config);
    } else {
      adapter = adapterOrType;
    }

    CounterAdapter.NUMBER_ADAPTER = adapter;
  }

  static setStringAdapter(
    adapterOrType:
      | StringAdapter
      | 'string'
      | 'intl-segmenter'
      | 'grapheme-splitter',
  ) {
    let adapter: StringAdapter = BuildInStringAdapter();

    if (isString(adapterOrType)) {
      if (adapterOrType === 'string') adapter = BuildInStringAdapter();
      else if (adapterOrType === 'intl-segmenter')
        adapter = BuildInIntlSegmenterAdapter();
      else if (adapterOrType === 'grapheme-splitter')
        adapter = GraphemeSplitterAdapter();
    } else {
      adapter = adapterOrType;
    }

    CounterAdapter.STRING_ADAPTER = adapter;
  }
}
