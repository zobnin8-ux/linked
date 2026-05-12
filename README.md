# linkedin-audit

Лендинг и воронка бесплатного AI-аудита LinkedIn-профиля для русскоязычных специалистов в US/EU: пользователь вставляет ссылку на профиль → в фоне парсинг (Proxycurl) и анализ (Claude) → на странице — топ-инсайты и severity score, полный отчёт уходит на email (Resend).

## Стек

- **Next.js 15** (App Router), TypeScript, Tailwind CSS v4  
- **Supabase** (Postgres, server-only service role)  
- **Proxycurl** (профиль LinkedIn)  
- **Anthropic Claude** (`@anthropic-ai/sdk`)  
- **Resend** + **React Email**  
- **PostHog** (клиент + сервер, опционально)  
- **Vercel**: `waitUntil` из `@vercel/functions` для фонового пайплайна  

## Локальный запуск

```bash
npm install
cp .env.example .env.local
# заполни .env.local
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Переменные окружения

См. [`.env.example`](./.env.example). Кратко:

| Обязательно для «живой» воронки |
|----------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `PROXYCURL_API_KEY`, `ANTHROPIC_API_KEY` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| `NEXT_PUBLIC_APP_URL` (в проде — URL деплоя или свой домен) |

PostHog — по желанию (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_SERVER_KEY`).

## Supabase

В SQL Editor выполни миграцию:

[`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql)

Таблицы: `audits`, `rate_limits`. На MVP доступ через service role с сервера; RLS можно не включать, как в ТЗ.

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | разработка (Turbopack) |
| `npm run build` | production-сборка |
| `npm run start` | запуск после `build` |
| `npm run lint` | ESLint |

## Деплой (Vercel)

1. Импорт репозитория, указать root `D:\Linked` (или корень репо, если репо = проект).  
2. Добавить все переменные из `.env.example` в **Settings → Environment Variables**.  
3. Для длинного пайплайна с `waitUntil` на проде лучше **Vercel Pro** и лимит функции (в проекте задан `maxDuration` для `app/api/audit/start/route.ts`, см. также `vercel.json`).

## Структура (основное)

- `app/page.tsx` — лендинг  
- `app/audit/[id]/` — статус и результат аудита  
- `app/api/audit/start` — старт + `waitUntil(runAuditPipeline)`  
- `app/api/audit/status` — polling статуса (без сырого PII, email маскируется)  
- `lib/audit-pipeline.ts` — пайплайн: Supabase → Proxycurl → параллельно Claude → сохранение → Resend  

## Лицензия

Приватный продукт — уточни у владельца репозитория.
