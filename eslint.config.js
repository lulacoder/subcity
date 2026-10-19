//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import convexPlugin from '@convex-dev/eslint-plugin'

export default [
  ...tanstackConfig,
  ...convexPlugin.configs.recommended,
  {
    files: ['**/convex/**/*.ts'],
    rules: {
      '@convex-dev/import-wrong-runtime': 'error',
      '@convex-dev/no-collect-in-query': 'error',
      '@convex-dev/require-access-control': [
        'error',
        {
          pattern:
            '^(require|assert|check|ensure|can)([A-Z_]|$)|^has[A-Z_]|^getAuthUser$',
        },
      ],
    },
  },
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'convex/**/_generated/**',
      'convex/betterAuth/schema.ts',
    ],
  },
]
