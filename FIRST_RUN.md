# 🚀 Первый запуск VOLLEYDZEN

Пошаговая инструкция для запуска проекта в первый раз.

---

## ✅ Шаг 1: Установите зависимости

```bash
npm install
```

⏱️ Это займёт 2-3 минуты.

---

## ✅ Шаг 2: Создайте Telegram бота

### 2.1 Откройте @BotFather в Telegram

1. Найдите [@BotFather](https://t.me/BotFather) в поиске Telegram
2. Нажмите "Запустить" (Start)

### 2.2 Создайте нового бота

Отправьте команду:
```
/newbot
```

### 2.3 Введите название

```
VOLLEYDZEN
```
или любое другое название для вашего тестового бота.

### 2.4 Введите username

```
volleydzen_test_bot
```
или любой другой, главное чтобы заканчивался на `_bot`.

### 2.5 Скопируйте токен

BotFather отправит вам сообщение с токеном вида:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```

**ВАЖНО:** Сохраните этот токен, он понадобится на следующем шаге!

---

## ✅ Шаг 3: Настройте переменные окружения

### 3.1 Создайте .env.local

```bash
cp .env.example .env.local
```

### 3.2 Откройте .env.local в редакторе

```bash
# Windows
notepad .env.local

# macOS
open -e .env.local

# Linux
nano .env.local
```

### 3.3 Заполните обязательные переменные

```env
# 1. База данных (замените YOUR_PASSWORD на ваш пароль от PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/volleydzen"

# 2. JWT Secret (сгенерируйте случайную строку минимум 32 символа)
JWT_SECRET="заменить-на-случайную-строку-минимум-32-символа-длиной"

# 3. Telegram Bot Token (вставьте токен от @BotFather)
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890"
```

### 💡 Как сгенерировать JWT_SECRET:

**Linux/macOS:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Или просто используйте любую случайную строку минимум 32 символа:
```
my-super-secret-jwt-key-2025-volleydzen-app-12345
```

### 3.4 Сохраните файл

Нажмите Ctrl+S (Windows/Linux) или Cmd+S (macOS).

---

## ✅ Шаг 4: Настройте базу данных PostgreSQL

### 4.1 Убедитесь что PostgreSQL запущен

**Windows:**
1. Откройте "Службы" (Services)
2. Найдите "PostgreSQL"
3. Проверьте что статус "Запущено" (Running)

**macOS:**
```bash
brew services list
```

**Linux:**
```bash
sudo systemctl status postgresql
```

### 4.2 Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Введите пароль от PostgreSQL

# Создайте базу данных
CREATE DATABASE volleydzen;

# Выйдите
\q
```

### 4.3 Примените схему базы данных

```bash
npm run db:push
```

Вы должны увидеть:
```
✔ Generated Prisma Client
✔ The database is now in sync with your Prisma schema
```

### 4.4 Сгенерируйте Prisma Client

```bash
npm run db:generate
```

### 4.5 Заполните тестовыми данными

```bash
npm run db:seed
```

Это создаст:
- ✅ 4 уровня Энсо (Shoshin, Shugyosha, Jukuren, Satori)
- ✅ 2 тренеров
- ✅ 1 тестовый кэмп
- ✅ 2 онлайн-курса
- ✅ Шаблоны уведомлений

---

## ✅ Шаг 5: Проверьте настройки

```bash
npm run check:env
```

Если всё правильно, вы увидите:
```
🎉 ВСЕ ПЕРЕМЕННЫЕ НАСТРОЕНЫ ПРАВИЛЬНО!
```

Если есть проблемы, скрипт покажет что нужно исправить.

---

## ✅ Шаг 6: Запустите приложение

```bash
npm run dev
```

Вы должны увидеть:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

### 6.1 Откройте в браузере

Откройте http://localhost:3000

Вы должны увидеть главную страницу VOLLEYDZEN!

### 6.2 Проверьте консоль

Откройте DevTools (F12) и проверьте консоль.

Вы должны увидеть:
```
Telegram WebApp SDK не найден. Используем mock данные.
```

**Это нормально!** Когда вы открываете приложение в браузере (не в Telegram), используются тестовые данные.

---

## ✅ Шаг 7: (Опционально) Настройте для Telegram Mini App

Если хотите протестировать в реальном Telegram:

### 7.1 Установите ngrok

См. подробную инструкцию в [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### 7.2 Запустите ngrok

В **ОТДЕЛЬНОМ** терминале (не останавливая npm run dev):

```bash
ngrok http 3000
```

### 7.3 Скопируйте URL

Вы увидите что-то вроде:
```
Forwarding  https://abc123def.ngrok.io -> http://localhost:3000
```

Скопируйте `https://abc123def.ngrok.io`

### 7.4 Настройте Menu Button в боте

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите **Bot Settings**
5. Нажмите **Menu Button**
6. Нажмите **Configure Menu Button**
7. Введите текст кнопки: `Открыть приложение`
8. Введите URL: `https://abc123def.ngrok.io` (ваш URL от ngrok)

### 7.5 Откройте Mini App в Telegram

1. Найдите вашего бота в Telegram
2. Нажмите на иконку Menu (4 квадрата рядом с полем ввода)
3. Нажмите "Открыть приложение"
4. Приложение откроется в полноэкранном режиме!

---

## ✅ Готово! 🎉

Теперь у вас запущено приложение VOLLEYDZEN!

### Что дальше?

- 📖 Читайте [QUICKSTART.md](./QUICKSTART.md) для подробной информации
- 🔧 См. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) если что-то не работает
- 📱 См. [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) для настройки Telegram Mini App
- 💳 Настройте ЮКассу для тестовых платежей (см. TELEGRAM_SETUP.md)

### Полезные команды

```bash
# Запуск приложения
npm run dev

# Просмотр базы данных
npm run db:studio

# Проверка переменных окружения
npm run check:env

# Пересоздание БД (если что-то сломалось)
npm run db:push
npm run db:seed
```

---

## ❓ Возникли проблемы?

### База данных не подключается

См. раздел "База данных" в [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#-проблема-база-данных-не-подключается)

### Порт 3000 занят

```bash
# Запустите на другом порту
PORT=3001 npm run dev
```

### Prisma Client не найден

```bash
npm run db:generate
```

### Другие проблемы

См. полный список решений в [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Удачи в разработке! 🚀**
