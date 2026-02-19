# ЛОК VERA Landing

Лендинг проекта «ЛОК VERA» на Next.js (App Router).

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Домен и SEO

Главный домен задается в `src/app/lib/site.ts`:

- `domain`: `вера-лок.рф`
- `url`: `https://вера-лок.рф`

Используется в:

- `canonical` и `alternates`
- Open Graph / Twitter
- `robots.txt` (`Host`, `Sitemap`)
- `sitemap.xml`
- JSON-LD schema

## Подключенные верификации и аналитика

В `src/app/layout.tsx` подключены:

- Yandex Webmaster: `yandex-verification`
- Google Search Console: `google-site-verification`
- Яндекс.Метрика (`id=106874983` + `noscript`-пиксель)

## Отправка заявок в Telegram

Все формы на сайте отправляют заявку в `POST /api/lead`, а API-роут пересылает заявку в Telegram.

Нужные переменные:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Для локальной разработки

Создайте `.env.local`:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Деплой на Render через GitHub

На Render нужно создавать именно **Web Service** (не Static Site), потому что используется серверный маршрут `POST /api/lead`.

1. Подключите репозиторий GitHub в Render.
2. Создайте сервис типа `Web Service`.
3. Укажите команды:

```bash
Build Command: npm ci && npm run build
Start Command: npm run start
```

4. Добавьте переменные окружения в Render:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

5. Нажмите Deploy.

Файл `render.yaml` в корне проекта можно использовать для Blueprint-деплоя без ручного ввода команд.
