// eslint.config.cjs
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    // Применяем ко всем .js/.ts в src
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: { import: importPlugin },
    extends: [
      'eslint:recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'prettier'
    ],
    rules: {
      // порядок импортов
      'import/order': ['error', {
        groups: [['builtin','external'],'internal'],
        'newlines-between': 'always'
      }],
      // макс. длина строки 79
      'max-len': ['error', { code: 79, ignoreUrls: true }],
      // отступы 2 пробела
      'indent': ['error', 2, { SwitchCase: 1 }],
      // одинарные кавычки
      'quotes': ['error', 'single'],
      // обязательная точка с запятой
      'semi': ['error', 'always']
    }
  }
];
