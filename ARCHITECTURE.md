# 🏗️ Архитектура VOLLEYDZEN

## Технический стек

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript** - строгая типизация
- **Tailwind CSS** - utility-first стили
- **shadcn/ui** - компоненты на базе Radix UI
- **Telegram WebApp SDK** - интеграция с Telegram

### Backend
- **Next.js API Routes** - REST API
- **Prisma ORM** - type-safe работа с БД
- **PostgreSQL 15** - реляционная база данных
- **Redis** - кэш и rate limiting (планируется)

### Внешние сервисы
- **ЮKassa** - платежи (карты, СБП, рассрочка)
- **Vimeo** - видеохостинг для курсов
- **Yandex Maps** - карты и геолокация
- **Timeweb Cloud** - хостинг + S3 storage
- **Telegram Bot API** - уведомления

---

## Архитектура приложения

```
┌─────────────────────────────────────────────────────────────┐
│                    TELEGRAM MINI APP                         │
│                    (WebView в Telegram)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APPLICATION                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Frontend (React Server Components + Client)          │ │
│  │  - TMA страницы (/camps, /courses, /profile)          │ │
│  │  - Админ-панель (/admin)                              │ │
│  │  - UI компоненты (shadcn/ui)                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Backend (API Routes)                                  │ │
│  │  - REST API (/api/camps, /api/courses, etc)           │ │
│  │  - Авторизация (/api/auth/telegram)                   │ │
│  │  - Вебхуки (/api/webhook/yookassa, /telegram)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │  │    Redis     │    │  Timeweb S3  │
│   (Prisma)   │  │   (Cache)    │    │   (Files)    │
└──────────────┘  └──────────────┘    └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐    ┌──────────────┐
│   ЮKassa     │  │    Vimeo     │    │  Telegram    │
│  (Платежи)   │  │   (Видео)    │    │  Bot API     │
└──────────────┘  └──────────────┘    └──────────────┘
```

---

## Структура базы данных

### Основные таблицы и связи

```
users (пользователи)
  ├── role: user / trainer / admin
  ├── 1:N → bookings (записи на кэмпы)
  ├── 1:N → user_courses (купленные курсы)
  ├── 1:N → payments (платежи)
  └── 1:N → notifications (уведомления)

camps (кэмпы)
  ├── 1:N → camp_days (дни программы)
  ├── M:N → trainers (тренеры через camp_trainers)
  └── 1:N → bookings (записи участников)

bookings (бронирования)
  ├── status: pre_booked → deposit_paid → fully_paid
  ├── N:1 → user
  ├── N:1 → camp
  ├── N:1 → promo_code (опционально)
  └── 1:N → payments

courses (курсы)
  ├── 1:N → course_weeks
  │    └── 1:N → course_days
  │         └── M:N → exercises (через course_day_exercises)
  └── 1:N → user_courses (покупки)

user_courses (прогресс пользователя)
  ├── 1:N → user_day_progress
  ├── 1:N → user_exercise_progress
  └── 1:N → video_reviews (отчёты для тренера)
```

---

## Авторизация и безопасность

### Поток авторизации

```
1. User opens Mini App
   └─> Telegram SDK: window.Telegram.WebApp.initData

2. Frontend → POST /api/auth/telegram { initData }
   └─> Backend validates HMAC-SHA256
       └─> Check auth_date (< 1 hour)
           └─> Find or create user in DB
               └─> Generate JWT (7 days)
                   └─> Return { token, user }

3. Frontend stores JWT in memory (React Context)
   └─> All API requests: Authorization: Bearer <jwt>

4. Backend middleware validates JWT
   └─> Extract user_id and role
       └─> Check permissions
           └─> Process request
```

### Защита API

| Слой | Механизм | Реализация |
|------|----------|------------|
| Transport | HTTPS | Обязательно в production |
| Авторизация | JWT | HS256, TTL 7 дней |
| Telegram initData | HMAC-SHA256 | Валидация на сервере |
| SQL Injection | Prisma ORM | Параметризованные запросы |
| Rate Limiting | Redis | 60 req/min на IP |
| CSRF | SameSite cookies | Для admin панели |
| Webhooks | IP Whitelist | ЮKassa IP ranges |

---

## Платёжный процесс

### Полная оплата кэмпа

```
1. User: /camps/[id] → "ОПЛАТИТЬ"
2. Frontend → POST /api/camps/:id/book
   {
     paymentType: "full",
     promoCodeId: "...",
     pdpConsent: true,
     waiverConsent: true
   }

3. Backend:
   - Проверить доступность мест
   - Применить промокод (если есть)
   - Создать booking (status: pre_booked)
   - Вызвать ЮKassa API → createPayment
   - Сохранить payment (status: pending)
   - Вернуть { bookingId, paymentUrl }

4. Frontend → Telegram.WebApp.openLink(paymentUrl)

5. User оплачивает на странице ЮKassa

6. ЮKassa → POST /api/webhook/yookassa
   { event: "payment.succeeded", ... }

7. Backend:
   - Проверить IP whitelist
   - Обновить payment.status = succeeded
   - Обновить booking.status = fully_paid
   - Генерировать PDF квитанцию → S3
   - Отправить Telegram уведомление

8. User получает push: "🎉 Оплата прошла!"
```

### Депозит (предбронь 24ч)

```
1. POST /api/camps/:id/pre-book
   - booking.status = pre_booked
   - booking.pre_book_expires_at = NOW() + 24h
   - camp.current_participants++

2. Cron job (каждые 15 минут):
   - SELECT * FROM bookings WHERE
     status = 'pre_booked' AND
     pre_book_expires_at < NOW()
   - UPDATE booking.status = 'cancelled'
   - UPDATE camp.current_participants--
   - Отправить уведомление: "Бронь истекла"
```

---

## Видео-контент (Vimeo)

### Защита доступа к видео

```
1. User открывает тренировочный день
   GET /api/user/courses/:id/day/:num

2. Backend:
   - Проверить user_courses.status = active
   - Проверить доступ к этому дню
   - Вернуть exercises с vimeo_video_id

3. Frontend рендерит Vimeo iframe:
   <iframe src="https://player.vimeo.com/video/{id}" />

4. Vimeo проверяет:
   - Embed только с volleydzen.ru
   - Privacy: Private
```

### Ограничения

- ❌ Пользователь не может скачать видео
- ❌ Нельзя открыть прямую ссылку
- ✅ Работает только на нашем домене
- ✅ Защита через user_courses.status

---

## Уведомления (Telegram Bot API)

### Типы уведомлений

| Событие | Триггер | Шаблон |
|---------|---------|--------|
| Предбронь | POST /pre-book | pre_book_confirmed |
| Оплата | Webhook ЮKassa | payment_succeeded |
| Кэмп -3д | Cron 08:00 | camp_reminder_3days |
| Кэмп -1д | Cron 08:00 | camp_reminder_1day |
| Новый отзыв тренера | POST /video-reviews/:id | trainer_feedback |
| Напоминание о курсе | Cron 09:00 | course_reminder |

### Отправка уведомления

```typescript
await sendTelegramMessage(
  user.telegramId,
  "✅ Место забронировано!",
  [{ text: "Оплатить", url: paymentUrl }]
)
```

### Рассылка (массовая)

```
1. Admin → POST /api/admin/notifications/send
   {
     audience: "all" | "camp_participants" | "course_users",
     message: "🔥 Скидка -10%...",
     button: { text: "Купить", url: "..." }
   }

2. Backend:
   - Получить список telegram_id по фильтру
   - Добавить в очередь Redis (rate limit)
   - Обработка батчами по 30 msg/sec
   - Логирование в notification_history
```

---

## Cron задачи

### Расписание

```javascript
// lib/cron.ts
import cron from 'node-cron'

// Каждые 15 минут
cron.schedule('*/15 * * * *', async () => {
  await cancelExpiredPreBookings()
})

// Каждый час
cron.schedule('0 * * * *', async () => {
  await sendPaymentReminders() // -6ч до истечения
})

// Каждый день в 08:00
cron.schedule('0 8 * * *', async () => {
  await sendCampReminders3Days()
  await sendCampReminders1Day()
})

// Каждый день в 09:00
cron.schedule('0 9 * * *', async () => {
  await sendCourseReminders()
})
```

---

## Масштабирование

### Текущая нагрузка (Фаза 1)

- Пользователей: до 500
- DAU: ~50-100
- Concurrent: до 50
- Сервер: 2 vCPU, 2GB RAM (Timeweb)

### План масштабирования (Фаза 2+)

```
┌─────────────────────────────────────────────────┐
│         Load Balancer (Nginx)                   │
└─────────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐         ┌─────────┐
│ Next.js │         │ Next.js │
│ Node 1  │         │ Node 2  │
└─────────┘         └─────────┘
         │           │
         └─────┬─────┘
               ▼
    ┌──────────────────┐
    │   PostgreSQL     │
    │  (Primary +      │
    │   Replica)       │
    └──────────────────┘
               │
               ▼
    ┌──────────────────┐
    │   Redis Cluster  │
    │   (Cache + Queue)│
    └──────────────────┘
```

### Оптимизации

1. **Database**
   - Connection pooling (Prisma)
   - Read replicas для отчётов
   - Индексы на всех WHERE/JOIN полях

2. **Cache (Redis)**
   - Кэш каталогов (TTL 5 мин)
   - Кэш детальных страниц (TTL 1 мин)
   - Rate limiting counters

3. **CDN**
   - Static assets → Cloudflare
   - Images → Timeweb S3 + CDN
   - Videos → Vimeo CDN

4. **Code**
   - Next.js ISR для статики
   - Code splitting по роутам
   - Lazy loading компонентов

---

## Мониторинг и логирование

### Метрики

```
Production:
  - Sentry (ошибки frontend + backend)
  - Prometheus + Grafana (метрики сервера)
  - Audit Log в БД (действия admin)

Development:
  - Next.js dev console
  - Prisma query logging
  - Browser DevTools
```

### Алерты

- ❌ API response time > 1s
- ❌ Error rate > 5%
- ❌ Database connections > 80%
- ❌ Payment webhook failed
- ❌ Cron job failed

---

## Деплой

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    - npm ci
    - npm run build
    - npm test
    - prisma migrate deploy
    - rsync → Timeweb Cloud
    - pm2 restart
```

### Окружения

| Env | Ветка | URL | БД |
|-----|-------|-----|-----|
| Development | feature/* | localhost:3000 | Local PostgreSQL |
| Staging | develop | staging.volleydzen.ru | Timeweb (test) |
| Production | main | volleydzen.ru | Timeweb (prod) |

---

## Зависимости версий

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "typescript": "^5.4.0",
  "@prisma/client": "^5.14.0",
  "tailwindcss": "^3.4.0"
}
```

Критичные зависимости:
- `react-hook-form@7.55.0` - специфичная версия из ТЗ
- `@prisma/client` - должен совпадать с `prisma` в devDeps

---

**Последнее обновление:** 10 марта 2025
