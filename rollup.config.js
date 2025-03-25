// Import rollup plugins
// import { copy } from '@web/rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import { visualizer } from 'rollup-plugin-visualizer';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './dist/src/index.js',
  plugins: [
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
  ],
  output: [
    {
      file: './dist/timered-counter.esm-browser.js',
      format: 'es',
      name: 'TimeredCounter',
      sourcemap: true,
    },
    {
      file: './dist/timered-counter.global.js',
      format: 'umd',
      name: 'TimeredCounter',
      sourcemap: true,
    },
  ],
  preserveEntrySignatures: 'strict',
};
