# 🎯 Что делать дальше

## Сейчас нужно сделать

### 1. Установите зависимости

```bash
npm install
```

Это установит все пакеты из обновлённого `package.json`, включая:
- Все @radix-ui компоненты
- sonner, vaul, recharts
- dotenv для скрипта проверки

### 2. Создайте .env.local

```bash
cp .env.example .env.local
```

Затем откройте `.env.local` и заполните минимум 3 переменные:

```env
DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/volleydzen"
JWT_SECRET="любая-случайная-строка-минимум-32-символа-длиной"
TELEGRAM_BOT_TOKEN="токен-от-BotFather"
```

### 3. Создайте бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Введите имя: `VOLLEYDZEN Test` (или любое другое)
4. Введите username: `volleydzen_test_bot` (должен заканчиваться на _bot)
5. **СКОПИРУЙТЕ ТОКЕН** - это ваш `TELEGRAM_BOT_TOKEN`

### 4. Настройте базу данных

```bash
# Создайте БД (если ещё не создали)
psql -U postgres -c "CREATE DATABASE volleydzen;"

# Примените схему
npm run db:push

# Сгенерируйте Prisma Client
npm run db:generate

# Заполните тестовыми данными
npm run db:seed
```

### 5. Проверьте настройки

```bash
npm run check:env
```

Если всё ОК, вы увидите:
```
🎉 ВСЕ ПЕРЕМЕННЫЕ НАСТРОЕНЫ ПРАВИЛЬНО!
```

### 6. Запустите приложение

```bash
npm run dev
```

Откройте http://localhost:3000 - вы увидите главную страницу!

---

## Если хотите протестировать в Telegram

### 1. Установите ngrok

**macOS:**
```bash
brew install ngrok
```

**Windows:**
Скачайте с https://ngrok.com/download

**Linux:**
```bash
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin
```

### 2. Зарегистрируйтесь на ngrok.com

1. Зайдите на https://ngrok.com
2. Зарегистрируйтесь (бесплатно)
3. Получите authtoken
4. Добавьте токен:
   ```bash
   ngrok config add-authtoken ВАШ_ТОКЕН
   ```

### 3. Запустите ngrok

В **отдельном терминале** (не останавливая `npm run dev`):

```bash
ngrok http 3000
```

Скопируйте URL вида: `https://abc123.ngrok.io`

### 4. Настройте Menu Button в боте

1. Откройте @BotFather
2. `/mybots`
3. Выберите вашего бота
4. Bot Settings → Menu Button → Configure Menu Button
5. Текст: `Открыть приложение`
6. URL: `https://abc123.ngrok.io` (ваш URL от ngrok)

### 5. Откройте Mini App в Telegram

1. Найдите вашего бота в Telegram
2. Нажмите на иконку Menu (⚡ рядом с полем ввода)
3. Нажмите "Открыть приложение"
4. **Готово!** Приложение открылось в Telegram!

---

## Структура команд для удобства

### Разработка (2 терминала)

**Терминал 1:**
```bash
npm run dev
```

**Терминал 2 (опционально, для Telegram):**
```bash
ngrok http 3000
```

### Работа с БД

```bash
npm run db:studio    # Открыть GUI для просмотра данных
npm run db:push      # Применить схему к БД
npm run db:seed      # Заполнить тестовыми данными
```

### Проверки

```bash
npm run check:env    # Проверить переменные окружения
npm run lint         # Проверить код
```

---

## Частые вопросы

### Q: Нужен ли TELEGRAM_BOT_SECRET?
**A:** Нет! Нужен только `TELEGRAM_BOT_TOKEN` от @BotFather.

### Q: Почему в консоли "Telegram WebApp SDK не найден"?
**A:** Это нормально когда вы открываете localhost в браузере. Используются mock данные. Для реального Telegram используйте ngrok.

### Q: Что делать если порт 3000 занят?
**A:** Запустите на другом порту: `PORT=3001 npm run dev`

### Q: Где хранятся переменные окружения?
**A:** В файле `.env.local` (он не коммитится в git)

### Q: Можно ли сделать фиксированный URL в ngrok?
**A:** Да! Создайте Static Domain на dashboard.ngrok.com (бесплатно 1 домен), затем:
```bash
ngrok http 3000 --domain=ваш-домен.ngrok.io
```

---

## Полезные файлы документации

- 📖 **[FIRST_RUN.md](./FIRST_RUN.md)** - Подробная инструкция для новичков
- ⚡ **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт
- 📱 **[TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)** - Всё про Telegram Mini App и ngrok
- 🛠️ **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Решение проблем
- 📋 **[CHEATSHEET.md](./CHEATSHEET.md)** - Шпаргалка по командам
- ✅ **[SETUP_FIXED.md](./SETUP_FIXED.md)** - Что было исправлено

---

## Если что-то пошло не так

1. Проверьте `.env.local` - все 3 обязательные переменные заполнены?
2. Запустите `npm run check:env`
3. Прочитайте [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. Попробуйте пересоздать зависимости:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run db:generate
   ```

---

**Удачи! 🚀**

Следующий этап после запуска: разработка модуля "Кэмпы" (см. PROGRESS.md)
