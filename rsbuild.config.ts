// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.js'
    },
    alias: {
      '@': './src'
    }
  },
  html: {
    template: './src/index.html'
  },
  output: {
    assetPrefix: '/',
  },
  tools: {
    postcss: {

    },
  },
});
