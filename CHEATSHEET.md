# 📋 Шпаргалка VOLLEYDZEN

Быстрый справочник по командам и настройкам.

---

## 🚀 Быстрый старт

```bash
# 1. Установка
npm install

# 2. Создайте .env.local
cp .env.example .env.local
# Затем отредактируйте .env.local

# 3. База данных
createdb volleydzen  # или через psql
npm run db:push
npm run db:generate
npm run db:seed

# 4. Запуск
npm run dev
```

Откройте http://localhost:3000

---

## 📦 NPM команды

```bash
# Разработка
npm run dev              # Запуск dev сервера (localhost:3000)
npm run build            # Production сборка
npm run start            # Запуск production сервера
npm run lint             # Проверка кода

# База данных
npm run db:push          # Применить схему к БД (быстро)
npm run db:migrate       # Создать миграцию (для production)
npm run db:generate      # Генерация Prisma Client
npm run db:studio        # GUI для БД (localhost:5555)
npm run db:seed          # Заполнить тестовыми данными

# Проверка
npm run check:env        # Проверить переменные окружения
```

---

## 🔐 Переменные окружения (.env.local)

### Минимум для запуска:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/volleydzen"
JWT_SECRET="случайная-строка-минимум-32-символа"
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
```

### Для Telegram Mini App:

```env
NEXT_PUBLIC_TMA_URL="https://xxxxx.ngrok.io"
```

### Для платежей:

```env
YOOKASSA_SHOP_ID="123456"
YOOKASSA_SECRET_KEY="live_ABCdef..."
```

---

## 🤖 Telegram Bot

### Создание бота

```
1. Открыть @BotFather
2. /newbot
3. Имя: VOLLEYDZEN
4. Username: volleydzen_bot
5. Скопировать токен → TELEGRAM_BOT_TOKEN
```

### Настройка Menu Button

```
1. @BotFather → /mybots
2. Выбрать бота
3. Bot Settings → Menu Button → Configure
4. Текст: "Открыть приложение"
5. URL: https://xxxxx.ngrok.io
```

---

## 🌐 ngrok для разработки

### Установка (macOS)
```bash
brew install ngrok
ngrok config add-authtoken YOUR_TOKEN
```

### Запуск

```bash
# Терминал 1: Next.js
npm run dev

# Терминал 2: ngrok
ngrok http 3000
```

### Фиксированный домен

```bash
# Создайте static domain на dashboard.ngrok.com
ngrok http 3000 --domain=volleydzen-dev.ngrok.io
```

---

## 🗄️ PostgreSQL

### Создание БД

```bash
# Через psql
psql -U postgres
CREATE DATABASE volleydzen;
\q

# Или через утилиту
createdb volleydzen
```

### Подключение

```bash
psql -U postgres -d volleydzen
```

### Полезные команды psql

```sql
\l                  -- Список БД
\c volleydzen       -- Подключиться к БД
\dt                 -- Список таблиц
\d users            -- Описание таблицы
\q                  -- Выход
```

---

## 💳 ЮКасса

### Тестовые данные

**Успешная оплата:**
```
Карта: 5555 5555 5555 4477
CVC: 123
Срок: 12/25
```

**Отклонённая оплата:**
```
Карта: 5555 5555 5555 5599
CVC: 123
Срок: 12/25
```

### Документация
https://yookassa.ru/docs/support/payments/onboarding/integration/cms-module/telegram

---

## 🐛 Частые проблемы

### Prisma Client не найден
```bash
npm run db:generate
```

### База данных не подключается
```bash
# Проверьте что PostgreSQL запущен
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Проверьте DATABASE_URL в .env.local
```

### Порт 3000 занят
```bash
# Запустите на другом порту
PORT=3001 npm run dev

# Или убейте процесс
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

### Зависимости не установлены
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Структура проекта

```
volleydzen/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница
│   │   ├── camps/             # Кэмпы
│   │   ├── courses/           # Курсы
│   │   ├── profile/           # Профиль
│   │   └── api/               # API endpoints
│   ├── components/
│   │   ├── ui/                # shadcn/ui компоненты
│   │   └── providers/         # React провайдеры
│   ├── lib/
│   │   ├── db.ts              # Prisma Client
│   │   ├── telegram.ts        # Telegram helpers
│   │   └── utils.ts           # Утилиты
│   └── styles/
│       └── globals.css        # Глобальные стили
├── prisma/
│   ├── schema.prisma          # Схема БД
│   └── seed.ts                # Seed данные
└── .env.local                 # Переменные окружения
```

---

## 🎨 Дизайн-система

### Цвета

```css
--primary: #E63946       /* Красный акцент */
--secondary: #2DC653     /* Зелёный успех */
--background: #0A0A0A    /* Тёмный фон */
--foreground: #F2F2F2    /* Светлый текст */
```

### Компоненты (shadcn/ui)

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
```

---

## 🔗 Полезные ссылки

### Документация

- [FIRST_RUN.md](./FIRST_RUN.md) - Первый запуск
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Настройка Telegram
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Решение проблем

### API Docs

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [ЮКасса](https://yookassa.ru/developers/api)
- [Prisma](https://www.prisma.io/docs)
- [Next.js](https://nextjs.org/docs)

---

## 🧪 Тестирование

### В браузере (localhost)
```
✅ Используются mock данные
✅ User: Иван Тестовый (id: 123456789)
✅ Вся функциональность работает
```

### В Telegram (через ngrok)
```
✅ Реальные данные пользователя из Telegram
✅ Telegram SDK доступен
✅ Haptic Feedback работает
✅ MainButton, BackButton доступны
```

---

## 🚦 Чеклист перед deploy

- [ ] Все переменные в .env.production заполнены
- [ ] DATABASE_URL указывает на production БД
- [ ] JWT_SECRET - случайная строка (не из примера!)
- [ ] TELEGRAM_BOT_TOKEN от production бота
- [ ] NEXT_PUBLIC_TMA_URL - production домен
- [ ] ЮКасса настроена на production магазин
- [ ] Миграции применены: `npm run db:migrate`
- [ ] Production сборка работает: `npm run build`

---

**Документация актуальна для версии 1.0.0**
