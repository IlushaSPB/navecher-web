# navecher-web

Фронт сервиса «На вечер» — аренда вечерних нарядов из шкафов девушек, Москва. Модель — как у Pickle («Airbnb для гардероба»):
владелица выставляет платье, арендатор находит его на сайте или в Telegram Mini App и запрашивает вечер.

Стек: **React 18 + TypeScript + Vite**, React Router, CSS Modules. Данные — из API [navecher-api](https://github.com/IlushaSPB/navecher-api);
он же раздаёт собранный сайт.

## Что умеет

**Приложение** — mobile-first SPA: одна и та же сборка работает как сайт и как Telegram Mini App.
Вход — только через Telegram: на сайте виджетом Telegram Login, внутри мини-аппа — автоматически по `initData`.
Этап 1 — фундамент: дизайн-система, оболочка с нижней навигацией, роутинг, вход, слой API и заглушки экранов
(лента, фильтры, платье, календарь, запрос, чаты, сделка, размещение, запрос владелице, профиль, правила, избранное, вход).
Этап 2 — каталог: лента с фильтрами, экран фильтров, карточка платья, календарь свободных дат. Фильтры и выбранная дата
живут в адресе (`?date=&size=&priceMax=&color=`), избранное — в localStorage.
Яндекс Метрика (`METRIKA_ID` приходит из `/api/config`) считает и переходы внутри SPA.

## Структура

```
src/app/                        вход (main.tsx), провайдеры, роутер, макеты: колонка, разделы с нижней навигацией
src/pages/                      экраны: по папке на раздел (feed, item, chats, place, profile, login…)
src/features/auth/              сессия: AuthProvider, useAuth, RequireAuth, виджет Telegram, вход для разработки
src/features/catalog-filters/   фильтры ленты в адресе: useCatalogFilters, черновик, варианты из /api/config
src/features/favorites/         избранное в localStorage: useFavorite, FavoriteButton
src/entities/item/              платье: хуки загрузки (лента, карточка, занятость, счётчик), подписи, карточка в ленте
src/shared/ui/                  UI-кит: кнопки, шапки, нижняя навигация, поля, выбор ячейками, расчёт, иконки…
src/shared/styles/              tokens.css (цвета, шрифты, размеры), глобальный сброс, шрифты
src/shared/api/                 http-клиент (JSON, cookie, Bearer, типизированные ошибки), типы и запросы к API
src/shared/telegram/            адаптер Mini App: ready/expand/цвета, нативная кнопка «Назад»
src/shared/config/              настройки сайта из /api/config
src/shared/lib/                 форматирование (деньги, даты по-русски), календарные даты, хранилище, Метрика, мелкие хуки
public/                         favicon
.github/workflows/deploy.yml    CI/CD: типы и сборка → dist на VPS с проверкой и откатом
```

Импорты из `src` — через алиас `@/` (`@/shared/ui`). Стили — CSS Modules рядом с компонентом, общие значения — только из `tokens.css`.

## Локальный запуск

Нужен запущенный бэкенд из [navecher-api](https://github.com/IlushaSPB/navecher-api) (`make run`, по умолчанию порт 8080).

```bash
npm ci
API_URL=http://localhost:8080 npm run dev   # http://localhost:5173, /api проксируется на Go-сервер
npm run build                               # проверка типов + сборка в dist/
```

Виджет Telegram Login работает только на домене, который задан боту в @BotFather (`/setdomain`), — на localhost он не войдёт.
Для локального входа запусти бэкенд с `DEV_AUTH=true`: на экране `/login` появится «Войти для разработки»
(тестовый пользователь `tgId 1001`). На проде `DEV_AUTH` не включать.

Чтобы бэкенд отдавал сборку сам, держи репозитории рядом: navecher-api по умолчанию берёт `../navecher-web/dist`.

## Деплой

Любой push в `main`: проверка типов → сборка → `dist/` на сервер в `/opt/navecher/web` → проверка, что главная и её скрипт
отдаются; если нет — возвращается прошлая версия. Сервис не перезапускается: Go-сервер читает файлы с диска на каждый запрос.

Сервер готовит `deploy/setup-server.sh` из navecher-api. Секреты GitHub — те же, что там: `DEPLOY_HOST`, `DEPLOY_USER=deploy`,
`DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`. В первый раз выкладывай сначала API, потом фронт.
