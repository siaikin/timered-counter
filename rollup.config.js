import { fileURLToPath } from 'url';

// Import rollup plugins
// import { copy } from '@web/rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import { visualizer } from 'rollup-plugin-visualizer';
import commonjs from '@rollup/plugin-commonjs';
import { pick } from 'remeda';

const inputFiles = {
  'timered-counter': './dist/src/index.js',
  'decimal-js-number-adapter': fileURLToPath(
    new URL('./dist/src/number-adapter/decimal-js.js', import.meta.url),
  ),
  'grapheme-splitter-string-adapter': fileURLToPath(
    new URL('./dist/src/string-adapter/grapheme-splitter.js', import.meta.url),
  ),
};

const plugins = () => [
  commonjs(),
  // Resolve bare module specifiers to relative paths
  nodeResolve(),
  // Minify JS
  // @ts-ignore
  terser({
    ecma: 2021,
    module: true,
    warnings: true,
  }),
  // Print bundle summary
  // @ts-ignore
  summary({
    showBrotliSize: true,
    showGzippedSize: true,
    showMinifiedSize: true,
  }),
  // Optional: copy any static assets to build directory
  // copy({
  //   patterns: ['images/**/*'],
  // }),
  visualizer({ gzipSize: true, brotliSize: true }),
];

const umdOutput = [
  {
    input: pick(inputFiles, ['timered-counter']),
    plugins: plugins(),
    output: {
      dir: 'dist',
      entryFileNames: '[name].global.js',
      format: 'umd',
      name: 'TimeredCounter',
      sourcemap: true,
    },
    external: ['decimal.js', 'grapheme-splitter'],
    preserveEntrySignatures: 'strict',
  },
  {
    input: pick(inputFiles, ['decimal-js-number-adapter']),
    plugins: plugins(),
    output: {
      dir: 'dist',
      entryFileNames: '[name].global.js',
      format: 'umd',
      name: 'TimeredCounterExternal.DecimalJsNumberAdapter',
      sourcemap: true,
    },
    preserveEntrySignatures: 'strict',
  },
  {
    input: pick(inputFiles, ['grapheme-splitter-string-adapter']),
    plugins: plugins(),
    output: {
      dir: 'dist',
      entryFileNames: '[name].global.js',
      format: 'umd',
      name: 'TimeredCounterExternal.GraphemeSplitterStringAdapter',
      sourcemap: true,
    },
    preserveEntrySignatures: 'strict',
  },
];

const esmOutput = [
  {
    input: pick(inputFiles, ['timered-counter']),
    plugins: plugins(),
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].esm-browser.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    external: ['decimal.js', 'grapheme-splitter'],
    preserveEntrySignatures: 'strict',
  },
  {
    input: pick(inputFiles, ['decimal-js-number-adapter']),
    plugins: plugins(),
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].esm-browser.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    preserveEntrySignatures: 'strict',
  },
  {
    input: pick(inputFiles, ['grapheme-splitter-string-adapter']),
    plugins: plugins(),
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].esm-browser.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    preserveEntrySignatures: 'strict',
  },
];

export default [...umdOutput, ...esmOutput];
