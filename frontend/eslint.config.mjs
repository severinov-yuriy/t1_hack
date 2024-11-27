import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true,
    next: true,
    jsxA11y: true,
    stylistic: true,
  },
  {
    name: 'ksur-blog/src',
    files: ['**/src/**/*.ts', '**/src/**/*.tsx'],
    rules: {
      'style/jsx-quotes': ['error', 'prefer-double'],
      'perfectionist/sort-imports': 'off',
    },
  },
  {
    name: 'ksur-blog/configs',
    files: ['*.ts', '*.md'],
    rules: {
      'ts/no-require-imports': 'off',
      'style/max-len': 'off',
    },
  },
  {
    name: 'ksur-blog/global',
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs'],
    rules: {
      'style/comma-dangle': [
        'error',
        {
          arrays: 'only-multiline',
          objects: 'only-multiline',
          imports: 'only-multiline',
          exports: 'only-multiline',
          functions: 'only-multiline',
        },
      ],
    },
  },
);
