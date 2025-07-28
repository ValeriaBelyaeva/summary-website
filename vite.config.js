// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // здесь вы можете прописать ваши алиасы, плагины и т. д.
  // например, чтобы подключать SCSS из src/styles:
  resolve: {
    alias: {
      '@styles': '/src/styles',
    }
  },
  server: {
    port: 5173,            // изменим порт, если нужно
    open: true             // автоматически открывать браузер
  },
  build: {
    outDir: 'dist',        // папка для финального бандла
    sourcemap: true        // собирать sourcemaps
  }
});
