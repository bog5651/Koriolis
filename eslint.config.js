import js from '@eslint/js';
import prettierConfig from '@vue/eslint-config-prettier';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import sort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/public/**',
      '**/.github/**',
      '**/.husky/**',
      '**/.vscode/**',
      '**/cache/**'
    ]
  },

  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig({
    extends: ['recommended']
  }),
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': sort
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^vue'], ['^@?\\w'], ['^@/\\w'], ['^@/components'], ['^.+\\.css']]
        }
      ],
      camelcase: 'off',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      'multiline-comment-style': ['error', 'separate-lines'],
      semi: ['error', 'always'],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 0,
          maxBOF: 0
        }
      ],
      'linebreak-style': ['error', 'unix']
    }
  },
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        webextensions: true
      }
    }
  }
];
