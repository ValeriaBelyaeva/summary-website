import { defineConfig } from 'vite';
import path from 'node:path';

/**
 * Vite configuration
 * --------------------------------------------------------------------------
 *  ▸ `root`        — исходники в ./src
 *  ▸ `build.outDir`— прод-бандл в ./dist
 *  ▸ Alias `@`     — быстрый импорт из src/ (@/app.js)
 *  ▸ Dev-сервер    — localhost:5173 с авто-open
 *  ▸ SCSS работает «из коробки», поэтому дополнительный плагин не нужен
 */
export default defineConfig({
  root: path.resolve(__dirname, 'src'),

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    host: 'localhost',
    port: 5173,
    open: true,
  },

  css: {
    /* Опционально: SourceMap для стилей в dev-режиме */
    devSourcemap: true,
  },
});
