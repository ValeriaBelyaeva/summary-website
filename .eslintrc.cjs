/* ============================================================================
   ESLint configuration
   ----------------------------------------------------------------------------
   ▸ Проверяем браузерный ES-модульный код (ES2021)
   ▸ Интегрируем Prettier для автo-форматирования
   ▸ Поддерживаем алиас «@ → src» в импортах
   ========================================================================== */

   module.exports = {
    root: true,
  
    /* Окружения ─ браузер, Node (для скриптов сборки) */
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
  
    /* Базовые пресеты + Prettier-интеграция */
    extends: [
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:prettier/recommended',   // превращает формат-ошибки Prettier в ESLint-warnings
    ],
  
    /* Современный парсер JS без TypeScript */
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  
    /* Доп. плагины */
    plugins: ['import'],
  
    /* Резолвер для алиаса @/… */
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js'],
        },
      },
    },
  
    /* Правила проекта */
    rules: {
      /* Стиль и «чистый JS» -------------------------------------------------- */
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  
      /* Порядок импорта ------------------------------------------------------ */
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',   // node встроенные
            'external',  // пакеты из npm
            'internal',  // алиас @
            'parent',    // ../
            'sibling',   // ./
            'index',     // ./index.js
          ],
          'newlines-between': 'always',
        },
      ],
  
      /* Разрешаем абсолютный алиас без расширения */
      'import/extensions': ['error', 'ignorePackages', {
        js: 'never',
      }],
    },
  
    /* Игнорируем сборочный вывод и зависимости */
    ignorePatterns: ['dist/', 'node_modules/'],
  };
  