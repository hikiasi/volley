# VOLLEYDZEN

**Telegram Mini App** — Платформа для волейболистов

> ты решаешь как играть и жить

---

## 🚀 Быстрый старт

```bash
# 1. Установите зависимости
npm install

# 2. Создайте .env.local
cp .env.example .env.local
# Затем отредактируйте .env.local (см. ниже)

# 3. Настройте БД
npm run db:push
npm run db:generate
npm run db:seed

# 4. Запустите
npm run dev
```

Откройте http://localhost:3000

### 📝 Минимальные переменные в .env.local:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/volleydzen"
JWT_SECRET="случайная-строка-минимум-32-символа"
TELEGRAM_BOT_TOKEN="токен-от-BotFather"
```

**👉 Подробная инструкция:** [NEXT_STEPS.md](./NEXT_STEPS.md)

---

## 📚 Документация

### Быстрый старт

- **[🎯 NEXT_STEPS.md](./NEXT_STEPS.md)** - Что делать сейчас (начните отсюда!)
- **[🚀 FIRST_RUN.md](./FIRST_RUN.md)** - Первый запуск для новичков (пошаговая инструкция)
- **[⚡ QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт для опытных разработчиков
- **[📋 CHEATSHEET.md](./CHEATSHEET.md)** - Шпаргалка по командам и настройкам

### Настройка

- **[📱 TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)** - Настройка Telegram Mini App, ngrok, ЮКасса
- **[🛠️ TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Решение частых проблем
- **[✅ SETUP_FIXED.md](./SETUP_FIXED.md)** - Что было исправлено в конфигурации

### Разработка

- **[📖 PROGRESS.md](./PROGRESS.md)** - Прогресс разработки
- **[✅ CHECKLIST.md](./CHECKLIST.md)** - Чеклист готовности

---