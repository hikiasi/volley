# 🚀 Быстрый старт VOLLEYDZEN

## Предварительные требования

- Node.js 20+ 
- PostgreSQL 15+
- npm или pnpm

## 1️⃣ Установка зависимостей

```bash
npm install
```

## 2️⃣ Настройка базы данных

### Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE volleydzen;
```

### Создайте файл `.env.local`:

```bash
cp .env.example .env.local
```

### Минимальная конфигурация для разработки:

```env
# База данных
DATABASE_URL="postgresql://postgres:password@localhost:5432/volleydzen"

# JWT (сгенерируйте случайную строку min 32 символа)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long-random-string"

# Telegram Bot Token от @BotFather
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."

# URL для Telegram Mini App (в разработке используйте ngrok)
NEXT_PUBLIC_TMA_URL="https://xxxxx.ngrok.io"

# ЮКасса (для тестовых платежей)
YOOKASSA_SHOP_ID="your_shop_id"
YOOKASSA_SECRET_KEY="your_secret_key"
```

## 3️⃣ Примените схему к базе данных

```bash
# Вариант 1: Применить схему напрямую (быстро для разработки)
npm run db:push

# Вариант 2: Создать миграцию (для production)
npm run db:migrate

# Генерация Prisma Client
npm run db:generate
```

## 4️⃣ Заполните базу тестовыми данными

```bash
npm run db:seed
```

Это создаст:
- 4 уровня Энсо (Shoshin, Shugyosha, Jukuren, Satori)
- 2 тренеров
- 1 тестовый кэмп (Москва, Октябрь 2025)
- 2 курса (Прыжок PRO, Скорость 100)
- Шаблоны уведомлений

## 5️⃣ Запустите сервер разработки

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

## 6️⃣ (Опционально) Prisma Studio

Для просмотра и редактирования данных в БД:

```bash
npm run db:studio
```

Откроется в браузере на `http://localhost:5555`

---

## 🧪 Режим разработки без Telegram

Приложение автоматически определяет что запущено вне Telegram и использует mock данные:

```typescript
{
  id: 123456789,
  first_name: 'Иван',
  last_name: 'Тестовый',
  username: 'test_user'
}
```

Это позволяет разрабатывать и тестировать без настройки Telegram бота.

---

## 🔧 Полезные команды

```bash
# Разработка
npm run dev              # Запуск dev сервера
npm run build            # Production сборка
npm run start            # Запуск production сервера
npm run lint             # Проверка кода

# База данных
npm run db:push          # Применить схему к БД
npm run db:migrate       # Создать миграцию
npm run db:generate      # Генерация Prisma Client
npm run db:studio        # Prisma Studio GUI
npm run db:seed          # Заполнить тестовыми данными
```

---

## 📁 Структура проекта

```
volleydzen/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx         # Главная страница (✅ готова)
│   │   ├── camps/           # Кэмпы (🔄 в разработке)
│   │   ├── courses/         # Курсы (⏳ планируется)
│   │   ├── profile/         # Профиль (⏳ планируется)
│   │   └── api/             # REST API
│   ├── components/
│   │   ├── ui/              # shadcn/ui компоненты
│   │   └── providers/       # React провайдеры
│   ├── lib/
│   │   ├── db.ts            # Prisma Client
│   │   ├── telegram.ts      # Telegram helpers
│   │   └── utils.ts         # Утилиты
│   └── styles/
│       └── globals.css      # Глобальные стили
├── prisma/
│   ├── schema.prisma        # Схема БД
│   └── seed.ts              # Seed данные
└── .env.example             # Пример переменных окружения
```

---

## 🎨 Дизайн-система

### Цвета (VOLLEYDZEN Brand)

```css
--background: #0A0A0A     /* Тёмный фон */
--primary: #E63946         /* Красный акцент */
--secondary: #2DC653       /* Зелёный успех */
--foreground: #F2F2F2      /* Светлый текст */
```

### Компоненты UI

Используем **shadcn/ui** - коллекция копируемых компонентов на базе Radix UI.

Доступные компоненты:
- Button (с вариантами: default, outline, ghost, secondary)
- Card (для карточек кэмпов, курсов)
- Badge (для бейджей HOT, NEW, уровней)
- Progress (прогресс-бары заполненности)

---

## 🔐 Авторизация

### Как работает Telegram Auth:

1. Пользователь открывает Mini App
2. Telegram передаёт `initData` с подписью HMAC-SHA256
3. Frontend отправляет `POST /api/auth/telegram`
4. Backend проверяет подпись и возвращает JWT
5. JWT используется для всех защищённых запросов

### Тестирование авторизации:

```bash
curl -X POST http://localhost:3000/api/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"initData": "..."}'
```

В режиме разработки можно пропустить проверку initData.

---

## 🐛 Отладка

### Проблема: "Prisma Client not found"

```bash
npm run db:generate
```

### Проблема: "Database connection error"

Проверьте `DATABASE_URL` в `.env.local` и доступность PostgreSQL:

```bash
psql -h localhost -U postgres -d volleydzen
```

### Проблема: "Telegram WebApp SDK не найден"

Нормально для режима разработки. Используются mock данные.

---

## 📚 Дополнительная документация

- [Техническое задание](./docs/TZ.md) - полное ТЗ проекта
- [Прогресс разработки](./PROGRESS.md) - что сделано и что планируется
- [README.md](./README.md) - общая информация о проекте

---

## 🆘 Помощь

Если возникли проблемы:

1. Проверьте версии: Node.js 20+, PostgreSQL 15+
2. Убедитесь что все зависимости установлены: `npm install`
3. Проверьте `.env.local` - все обязательные переменные заполнены
4. Пересоздайте Prisma Client: `npm run db:generate`

---

**Готово к разработке! 🚀**

Следующий этап: [Модуль "Кэмпы"](./PROGRESS.md#этап-2-модуль-кэмпы)