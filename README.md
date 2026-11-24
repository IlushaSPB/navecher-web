# navecher-web

Фронт сервиса «На вечер» — аренда вечерних нарядов из шкафов девушек, Москва. Модель — как у Pickle («Airbnb для гардероба»):
владелица выставляет платье, арендатор находит его на сайте или в Telegram Mini App и запрашивает вечер.

Данные — из API [navecher-api](https://github.com/IlushaSPB/navecher-api); он же раздаёт собранный сайт.

## Стек

- **React 18 + TypeScript (strict) + Vite 5**, React Router 6, CSS Modules; алиас `@/` → `src/`.
- **TanStack Query 5** — загрузка и кэш данных; свой http-клиент (`fetch`, cookie, Bearer, типизированные ошибки).
- **Vitest 3 + jsdom + Testing Library + MSW 2** — тесты; те же моки MSW работают в браузере (`npm run dev:mock`).
- **ESLint 9** (typescript-eslint с типами, react-hooks, правила слоёв FSD) и **Prettier** (без `;`, одинарные кавычки, 120 колонок).
- Node 22 (как в CI), версии зависимостей закреплены точно.

## Что умеет

**Приложение** — mobile-first SPA: одна и та же сборка работает как сайт и как Telegram Mini App.
Вход — только через Telegram: на сайте виджетом Telegram Login, внутри мини-аппа — автоматически по `initData`.
Этап 1 — фундамент: дизайн-система, оболочка с нижней навигацией, роутинг, вход, слой API и заглушки экранов
(лента, фильтры, платье, календарь, запрос, чаты, сделка, размещение, запрос владелице, профиль, правила, избранное, вход).
Этап 2 — каталог: лента с фильтрами, экран фильтров, карточка платья, календарь свободных дат. Фильтры и выбранная дата
живут в адресе (`?date=&size=&priceMax=&color=`), избранное — в localStorage.
Яндекс Метрика (`METRIKA_ID` приходит из `/api/config`) считает и переходы внутри SPA.

## Структура

Слои [Feature-Sliced Design](https://feature-sliced.design), сверху вниз:

```
src/app/                        вход (main.tsx), провайдеры (React Query, сессия), роутер, макеты, Метрика
src/pages/<экран>/              экраны: feed, filters, item, login, profile, place, chats, deal, request, rules…
src/features/auth/              вход и выход: AuthProvider, useAuth, RequireAuth, виджет Telegram, вход для разработки
src/features/catalog-filters/   фильтры ленты в адресе: useCatalogFilters, черновик, варианты из /api/config
src/features/favorites/         избранное в localStorage: useFavorite, FavoriteButton
src/entities/item/              платье: api.ts, itemKeys, хуки (лента, карточка, занятость, счётчик), подписи, карточки
src/entities/session/           текущий пользователь: api.ts, sessionKeys (['me']), useMe
src/shared/api/                 http-клиент, ApiError, createQueryClient, типы API; mocks/ — моки MSW и фикстуры
src/shared/config/              настройки сайта из /api/config: useConfig, useToday
src/shared/ui/                  UI-кит: кнопки, шапки, нижняя навигация, поля, календарь, иконки…
src/shared/lib/                 форматирование (деньги, даты по-русски), календарные даты, хранилище, Метрика, хуки
src/shared/telegram/            адаптер Mini App: ready/expand/цвета, нативная кнопка «Назад»
src/shared/styles/              tokens.css (цвета, шрифты, размеры), глобальный сброс, шрифты
src/shared/test/                настройка Vitest и renderRoute / createQueryWrapper для тестов
eslint/fsd.js                   правила слоёв для ESLint
.github/workflows/              ci.yml — проверки PR; deploy.yml — проверки и выкладка main
```

Стили — CSS Modules рядом с компонентом, общие значения — только из `tokens.css`.

### Правила слоёв (проверяет `npm run lint`)

- Импорт только вниз: `app → pages → features → entities → shared`.
- Слайсы одного слоя не знают друг о друге: `features/a` не импортирует `features/b` (то же для `entities`, `pages`).
  Общее для двух фич — опускается в `entities` или `shared`. Сегменты `shared` друг друга импортировать могут.
- Чужой слайс — только через его `index.ts`: `@/features/auth`, а не `@/features/auth/ui/…`.
  `shared` — по сегментам (`@/shared/ui`, `@/shared/api`), а `lib` — по модулям (`@/shared/lib/format`).
- Внутри слайса — относительные импорты (`./`, `../`); выйти за слайс через `../../` нельзя — для этого `@/`.

### Данные: как добавить запрос

У сущности три файла: `api/api.ts` — обычные функции запросов, `api/keys.ts` — фабрика ключей кэша,
`model/useX.ts` — хуки на `useQuery`/`useMutation`. Наружу — через `index.ts`.

```ts
// entities/item/api/api.ts
export const fetchItem = (id: number, signal?: AbortSignal) => request<Item>(`/api/items/${id}`, { signal })
// entities/item/api/keys.ts
export const itemKeys = {
  all: ['items'] as const,
  detail: (id: number) => [...itemKeys.all, 'detail', id] as const,
}
// entities/item/model/useItem.ts
export const useItem = (id: number) =>
  useQuery({ queryKey: itemKeys.detail(id), queryFn: ({ signal }) => fetchItem(id, signal) })
```

Мутации после успеха сбрасывают свои ключи: `queryClient.invalidateQueries({ queryKey: itemKeys.all })`;
вход и выход сбрасывают `['me']`. Настройки по умолчанию (`shared/api/queryClient.ts`): свежесть 30 с,
4xx не повторяются, сеть и 5xx — одна повторная попытка, фокус окна не перезапрашивает (Mini App).

Ошибки API — `ApiError` со `status`, `code` (`bad_request`, `validation`, `unauthorized`, `forbidden`, `not_found`,
`conflict`, `too_large`, `unavailable`, `internal`), `message` и `fields` (`{"поле": "причина"}` для форм).
Проверка: `isApiError(e, 'not_found')` или `isApiError(e, 404)`. Старые ответы `{"error": "..."}` тоже понимаются —
код берётся из статуса.

## Команды

```bash
npm ci
npm run dev            # http://localhost:5173, /api проксируется на Go-сервер (API_URL, по умолчанию :8080)
npm run dev:mock       # то же без бэкенда: ответы API подставляет MSW в браузере
npm run build          # проверка типов + сборка в dist/
npm run typecheck      # tsc
npm run lint           # ESLint, 0 ошибок и 0 предупреждений
npm run format         # Prettier — переписать файлы; format:check — только проверить
npm test               # Vitest один раз; test:watch — в режиме наблюдения
npm run api:types      # типы из ../navecher-api/api/openapi.yaml → src/shared/api/schema.gen.ts
```

## Локальный запуск с бэкендом

Нужен запущенный бэкенд из [navecher-api](https://github.com/IlushaSPB/navecher-api) (`make run`, по умолчанию порт 8080):
`API_URL=http://localhost:8080 npm run dev`.

Виджет Telegram Login работает только на домене, который задан боту в @BotFather (`/setdomain`), — на localhost он не войдёт.
Для локального входа запусти бэкенд с `DEV_AUTH=true`: на экране `/login` появится «Войти для разработки»
(тестовый пользователь `tgId 1001`). На проде `DEV_AUTH` не включать.

Чтобы бэкенд отдавал сборку сам, держи репозитории рядом: navecher-api по умолчанию берёт `../navecher-web/dist`.

## Разработка без бэкенда: `npm run dev:mock`

Приложение стартует с [MSW](https://mswjs.io): `public/mockServiceWorker.js` перехватывает запросы к `/api` и отвечает
моками из `src/shared/api/mocks/` — восемь платьев, настройки, вход для разработки (`/api/auth/dev` + `/api/me`).
Так экран можно делать раньше, чем появится эндпоинт. В прод-сборку моки и воркер не попадают.

Новый эндпоинт: добавь обработчик в файл своего раздела (`mocks/catalog.ts`, `mocks/auth.ts`… или новый `mocks/<раздел>.ts`
с массивом `<раздел>Handlers`, подключённым в `mocks/handlers.ts`), данные — в `mocks/fixtures/`, ошибки — через
`apiError(400, 'validation', '…', { поле: 'причина' })`. Те же обработчики сразу работают в тестах. Запрос к `/api`
без мока — предупреждение в консоли браузера и падение теста.

## Тесты

Vitest + jsdom + Testing Library; сеть — MSW (`src/shared/test/setup.ts` поднимает сервер с теми же моками).
Тест лежит рядом с кодом (`*.test.ts(x)`). Экран — `renderRoute(<ItemPage />, { path: '/items/:id', url: '/items/1' })`,
хук — `renderHook(() => useItem(1), { wrapper: createQueryWrapper() })`, свой ответ — `server.use(http.get(...))`.

## CI и деплой

`ci.yml` — на каждый PR и push в рабочие ветки: `npm ci` → format:check → lint → typecheck → test → build.

`deploy.yml` — любой push в `main`: линтер и тесты → проверка типов и сборка → `dist/` на сервер в `/opt/navecher/web` →
проверка, что главная и её скрипт отдаются; если нет — возвращается прошлая версия. Сервис не перезапускается:
Go-сервер читает файлы с диска на каждый запрос.

Сервер готовит `deploy/setup-server.sh` из navecher-api. Секреты GitHub — те же, что там: `DEPLOY_HOST`, `DEPLOY_USER=deploy`,
`DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`. В первый раз выкладывай сначала API, потом фронт.

## Как работаем вдвоём

Зоны ответственности, архитектура, правила веток, коммитов и миграций — в [CLAUDE.md](CLAUDE.md) (его читают и люди, и Claude Code).
Личное — в `CLAUDE.local.md` (не в git): скопируй `CLAUDE.local.example.md` и впиши себя.
