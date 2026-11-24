# navecher-web — правила для Claude

Фронт «На вечер» (P2P-аренда вечерних платьев, Москва): одна сборка работает и как сайт, и как Telegram Mini App.
React 18 + TypeScript strict + Vite 5, React Router, TanStack Query v5, CSS Modules. API и контракт — соседний `../navecher-api`
(у него свой `CLAUDE.md`). Что умеет приложение и как запускать — `README.md`.

## Кто работает

Двое, оба фулстек, делим **по фичам**: фича целиком (миграция → бэк → контракт → фронт) — у одного человека.
У каждого свой Claude Code. **В начале сессии прочитай `CLAUDE.local.md`** (не в git; шаблон — `CLAUDE.local.example.md`):
там имя разработчика и его зона. Если файла нет — спроси, кто работает, и предложи создать его из шаблона.

| Зона                                                     | Владелец  | Папки                                                                                                                              |
| -------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| вход, сессия                                             | Илья      | `features/auth`, `entities/session`, `pages/login`                                                                                 |
| каталог: лента, фильтры, карточка, календарь, избранное  | Илья      | `entities/item`, `features/catalog-filters`, `features/favorites`, `pages/{feed,filters,item,favorites}` (кроме `ItemRequestPage`) |
| размещение, «Мой гардероб», профиль, правила             | Илья      | `pages/{place,profile,rules}`, будущие `features/listing-*`                                                                        |
| Mini App, realtime-подписка                              | Илья      | `shared/telegram`, будущий `shared/realtime`                                                                                       |
| сделка: запрос, подтверждение, статусы, передача/возврат | Ростислав | `pages/item/ItemRequestPage`, `pages/{deal,request}`, будущие `entities/deal`, `features/deal-*`                                   |
| чат сделки, споры, отзывы, «Мои сделки»                  | Ростислав | `pages/chats`, будущие `entities/message`, `features/chat`, `features/{dispute,review,my-deals}`                                   |
| **общая зона**                                           | оба       | `shared/**` (UI-кит, api, lib, styles), `app/**` (роутер, провайдеры), `eslint/`, конфиги, CI, этот файл                           |

Новый экран в чужом разделе (например, блок «Мои сделки» в профиле) — владелец раздела оставляет место, владелец фичи делает
виджет в своём `features/<слайс>` и экспортирует через `index.ts`.

### Обязательные правила для Claude

1. **Чужая зона — не правь.** Остановись и скажи: «это зона <имя>, нужно: …», предложи готовый текст задачи для него.
2. **Общая зона** — только минимально и отдельным коммитом; предупреди, что это уйдёт отдельным маленьким PR.
   Новый компонент в UI-кит — только если он нужен двум фичам; иначе держи его в своём слайсе.
3. Нужен эндпоинт, которого ещё нет — **сначала контракт** в `../navecher-api/api/paths/<фича>.yaml`, затем `npm run api:types`,
   мок в `shared/api/mocks/<фича>.ts` — и можно делать экран, не дожидаясь бэка (`npm run dev:mock`).
4. Перед тем как сказать «готово» — `npm run format:check && npm run lint && npm run typecheck && npm test`.

## Архитектура — Feature-Sliced Design

Слои и импорты (их проверяет ESLint, правила — `eslint/fsd.js`):

```
src/app/        вход, провайдеры (QueryClient, роутер, метрика), макеты с нижней навигацией
src/pages/      экраны: по слайсу на раздел (feed, item, chats, deal, place, profile, login…)
src/features/   действия пользователя: auth, catalog-filters, favorites…
src/entities/   сущности и их данные: item, session (дальше deal, message)
src/shared/     без бизнес-смысла: ui (кит), api (http, типы, моки), lib, config, styles, telegram, test
```

1. Зависимости только вниз: `app → pages → features → entities → shared`.
2. Слайсы одного слоя не импортируют друг друга (`features/a ↛ features/b`). Общее — опусти слоем ниже.
3. Чужой слайс — только через его `index.ts`: `@/entities/item`, не `@/entities/item/model/useItem`.
   `shared` — по сегментам (`@/shared/ui`, `@/shared/api`); `@/shared/lib/<модуль>` и `@/shared/styles/<файл>` — можно по файлу.
4. Внутри слайса — относительные импорты; выходить из слайса через `../../` нельзя — для этого `@/`.

Структура слайса: `api/` (функции запросов + ключи), `model/` (хуки), `ui/` (компоненты + `*.module.css`), `lib/`, `index.ts`.

## Данные

- **Типы API** — только из контракта: `npm run api:types` пишет `src/shared/api/schema.gen.ts` (руками не править),
  короткие имена — в `src/shared/api/types.ts` (`export type Item = S['ItemDetail']`). Свои дубли типов ответов не заводить.
- **Запросы** — TanStack Query. Шаблон для новой сущности:
  ```ts
  // entities/x/api/api.ts — обычные функции, signal последним
  export const fetchX = (id: number, signal?: AbortSignal) => request<X>(`/api/x/${id}`, { signal })
  // entities/x/api/keys.ts
  export const xKeys = {
    all: ['x'] as const,
    list: (f: XQuery) => [...xKeys.all, 'list', f] as const,
    detail: (id: number) => [...xKeys.all, 'detail', id] as const,
  }
  // entities/x/model/useX.ts
  export const useX = (id: number) =>
    useQuery({ queryKey: xKeys.detail(id), queryFn: ({ signal }) => fetchX(id, signal) })
  // мутация: onSuccess → queryClient.invalidateQueries({ queryKey: xKeys.all })
  ```
- **Ошибки**: `ApiError` (`status`, `code`, `message`, `fields`); проверка — `isApiError(e, 'not_found')`.
  `fields` — ошибки полей формы с сервера, показывать у поля.
- **Моки** (MSW): `src/shared/api/mocks/<область>.ts` экспортирует `<область>Handlers`, подключается в `mocks/handlers.ts`,
  данные — в `mocks/fixtures/`. Одни и те же моки работают в `npm run dev:mock` и в тестах (в тесте — `server.use(...)`).
  Значения в моках — как в настоящем API (типы из контракта это проверят).
- Состояние фильтров и выбранной даты — в адресе (`?date=&size=…`), не в глобальном сторе.

## Стили и UI

- Цвета, шрифты, отступы — **только переменные из `src/shared/styles/tokens.css`**. Новое значение — сначала токен.
- CSS Modules рядом с компонентом. Mobile-first, ширина колонки до 480px; учитывать safe area Mini App.
- Дизайн согласован (гибрид макетов Ильи и Ростислава); палитра: ink `#141012`, бежевый фон `#f2efe9`, berry `#8C2E52`.
  Шрифты: Jost (wordmark NAVECHER) + Inter Tight.

## Код

- DRY и SOLID: компонент делает одно; логика — в хуках `model/`, разметка — в `ui/`; зависимости — через пропсы/хуки, без синглтонов.
- Файл ≤ 300 строк, функция/компонент ≤ 60 строк. Больше — дели.
- Комментарии — по-русски; тексты ошибок в коде и логи — по-английски; тексты интерфейса — по-русски.
- Тесты (Vitest + Testing Library + MSW) рядом с кодом: `*.test.ts(x)`. Хелперы — `@/shared/test`.

## Команды

```bash
npm run dev:mock    # без бэкенда, на моках MSW — http://localhost:5173
API_URL=http://localhost:8080 npm run dev   # с настоящим бэком (navecher-api: make run, DEV_AUTH=1)
npm test            # Vitest
npm run lint        # ESLint (в т.ч. правила слоёв)
npm run format      # Prettier
npm run typecheck
npm run api:types   # типы из ../navecher-api/api/openapi.yaml
```

## Процесс

- Ветки: `feature/ilya-<коротко>`, `feature/rostislav-<коротко>`; живут 2–3 дня. Перед PR — `git rebase origin/main`.
- В `main` — только через PR: второй смотрит, CI (`.github/workflows/ci.yml`) зелёный. Слияние — squash.
  **Push в `main` = деплой на прод** (`deploy.yml`). Защиты ветки на GitHub нет — это договорённость, Claude сам в `main` не пушит.
- Фича, которая трогает и API, и фронт: PR в оба репо; сначала вливается API (контракт + бэк), потом фронт.
- Коммиты: одна короткая строка по-русски («Чат: отправка сообщения»). **Без `Co-Authored-By` и любых трейлеров, без упоминаний Claude.**
- Коммит и push — только когда разработчик попросил.
- Секреты — никогда в git, чат и логи.
