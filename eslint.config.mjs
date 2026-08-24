import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // Pastas que o ESLint não deve analisar
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/**',
      'coverage/**',
    ],
  },

  // Arquivos analisados pelo ESLint
  {
    files: ['**/*.{js,mjs,cjs,ts}'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // Regras JavaScript
  pluginJs.configs.recommended,

  // Regras TypeScript
  ...tseslint.configs.recommended,

  // Integração com Prettier
  eslintPluginPrettierRecommended,
];