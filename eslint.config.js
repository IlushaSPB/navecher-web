import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { fsdLayers } from './eslint/fsd.js'

export default defineConfig(
  globalIgnores(['dist/', 'coverage/', 'public/mockServiceWorker.js', 'src/shared/api/schema.gen.ts']),

  // Все файлы: базовые правила JS и TypeScript без информации о типах.
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },

  // Конфиги и скрипты в корне работают в Node.
  {
    files: ['*.{js,ts}', 'eslint/**/*.js'],
    languageOptions: { globals: globals.node },
  },

  // Код приложения: правила с типами (промисы, any) и правила хуков React.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked, reactHooks.configs['recommended-latest']],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      // onClick={async () => …} — обычное дело для React; промисы в остальных местах проверяются
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      // колбэки в пропсах объявлены методами (onRetry(): void) и не используют this — ложные срабатывания
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  // Слои Feature-Sliced Design — см. eslint/fsd.js.
  ...fsdLayers('src'),

  // Последним: выключает правила оформления, за них отвечает Prettier.
  prettier,
)
