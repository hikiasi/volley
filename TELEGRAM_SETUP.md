# 📱 Настройка Telegram Mini App

Пошаговая инструкция по настройке VOLLEYDZEN как Telegram Mini App.

---

## 1️⃣ Создание Telegram бота

### Шаг 1: Создайте бота через @BotFather

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите название бота (например: `VOLLEYDZEN`)
4. Введите username бота (должен заканчиваться на `bot`, например: `volleydzen_bot`)
5. Скопируйте полученный **токен** - это ваш `TELEGRAM_BOT_TOKEN`

Пример токена:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```

### Шаг 2: Сохраните токен в .env.local

```env
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890"
```

---

## 2️⃣ Настройка ngrok для разработки

### Что такое ngrok?

ngrok создаёт публичный HTTPS туннель к вашему localhost, что необходимо для Telegram Mini Apps.

### Установка ngrok

#### Windows:
```bash
# Через Chocolatey
choco install ngrok

# Или скачайте с https://ngrok.com/download
```

#### macOS:
```bash
brew install ngrok
```

#### Linux:
```bash
# Скачайте и установите
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin
```

### Регистрация ngrok

1. Зарегистрируйтесь на [ngrok.com](https://ngrok.com)
2. Получите ваш authtoken
3. Добавьте токен:

```bash
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

### Запуск ngrok

```bash
# Запустите ваш Next.js сервер
npm run dev

# В ОТДЕЛЬНОМ терминале запустите ngrok
ngrok http 3000
```

Вы увидите что-то вроде:
```
Forwarding  https://abc123def.ngrok.io -> http://localhost:3000
```

### Добавьте URL в .env.local

```env
NEXT_PUBLIC_TMA_URL="https://abc123def.ngrok.io"
```

⚠️ **ВАЖНО**: Каждый раз при перезапуске ngrok URL меняется! Обновляйте `.env.local` и настройки бота.

### Фиксированный домен (рекомендуется для разработки)

Бесплатный аккаунт ngrok позволяет создать 1 фиксированный домен:

1. Зайдите в [ngrok Dashboard](https://dashboard.ngrok.com/domains)
2. Создайте Static Domain (например: `volleydzen-dev.ngrok.io`)
3. Запускайте ngrok с доменом:

```bash
ngrok http 3000 --domain=volleydzen-dev.ngrok.io
```

Теперь URL не будет меняться!

---

## 3️⃣ Настройка Mini App в Telegram

### Шаг 1: Создайте Web App через @BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/mybots`
3. Выберите вашего бота (`volleydzen_bot`)
4. Нажмите **Bot Settings** → **Menu Button** → **Configure Menu Button**
5. Введите название кнопки (например: `Открыть приложение`)
6. Введите URL вашего приложения:
   ```
   https://abc123def.ngrok.io
   ```

### Шаг 2: Настройте описание и картинку

```
/setdescription
VOLLEYDZEN — платформа для волейболистов. Кэмпы, онлайн-курсы, сообщество.

/setabouttext
Ты решаешь как играть и жить

/setuserpic
# Загрузите логотип бота (512x512 px)
```

### Шаг 3: Протестируйте Mini App

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку Menu (иконка с 4 квадратами рядом с полем ввода)
3. Нажмите **Открыть приложение**
4. Приложение откроется в полноэкранном режиме!

---

## 4️⃣ Проверка что всё работает

### В браузере (для разработки)

1. Откройте `http://localhost:3000` в браузере
2. Вы увидите предупреждение: "Telegram WebApp SDK не найден"
3. Это **нормально** - используются mock данные
4. Можете разрабатывать UI и функционал

### В Telegram (реальная проверка)

1. Откройте Mini App через бота
2. Проверьте что Telegram SDK инициализировался
3. Проверьте что данные пользователя загрузились
4. Проверьте навигацию и UI

### Отладка в Telegram Desktop

Telegram Desktop позволяет открыть DevTools для Mini Apps:

**Windows/Linux:**
```
Ctrl + Shift + I в окне Mini App
```

**macOS:**
```
Cmd + Option + I в окне Mini App
```

---

## 5️⃣ Настройка платежей через ЮКасса

### Документация ЮКасса для Telegram

Прочитайте официальный гайд:
https://yookassa.ru/docs/support/payments/onboarding/integration/cms-module/telegram

### Шаг 1: Подключите магазин к боту

1. Зайдите в [личный кабинет ЮКасса](https://yookassa.ru)
2. Откройте раздел **Интеграция** → **Telegram**
3. Введите username вашего бота (например: `@volleydzen_bot`)
4. Получите **Shop ID** и **Secret Key**

### Шаг 2: Добавьте данные в .env.local

```env
YOOKASSA_SHOP_ID="123456"
YOOKASSA_SECRET_KEY="live_ABCdef123456..."
```

### Шаг 3: Тестовые платежи

ЮКасса поддерживает тестовый режим:

1. В личном кабинете переключитесь на **тестовый** магазин
2. Используйте тестовые карты для проверки:
   - **Успешная оплата**: `5555 5555 5555 4477`
   - **Отклонённая оплата**: `5555 5555 5555 5599`
   - **CVC**: любой (123)
   - **Срок**: любой в будущем (12/25)

### Шаг 4: Настройка webhook для уведомлений

Webhook нужен чтобы получать уведомления об успешных платежах.

1. В личном кабинете ЮКасса откройте **Интеграция** → **HTTP-уведомления**
2. Введите URL:
   ```
   https://your-domain.ngrok.io/api/webhooks/yookassa
   ```
3. Получите **Secret для webhook**
4. Добавьте в `.env.local`:
   ```env
   YOOKASSA_WEBHOOK_URL="https://your-domain.ngrok.io/api/webhooks/yookassa"
   ```

---

## 6️⃣ Тестирование платежей в Telegram

### Способ 1: Через Telegram Payments

```typescript
// В вашем компоненте
const handleBuyClick = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openInvoice(invoiceLink, (status) => {
      if (status === 'paid') {
        console.log('Оплачено!')
      }
    })
  }
}
```

### Способ 2: Через redirectURL

```typescript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  body: JSON.stringify({
    amount: 5000, // 50 рублей
    description: 'Кэмп VOLLEYDZEN Москва',
  })
})

const { confirmationUrl } = await response.json()
window.Telegram.WebApp.openLink(confirmationUrl)
```

---

## 7️⃣ Production Deploy

### Когда приложение готово к production:

1. **Разверните на хостинге** (Timeweb, Vercel, Railway)
2. **Получите постоянный домен** (например: `app.volleydzen.ru`)
3. **Обновите NEXT_PUBLIC_TMA_URL**:
   ```env
   NEXT_PUBLIC_TMA_URL="https://app.volleydzen.ru"
   ```
4. **Обновите URL в @BotFather**:
   - `/mybots` → ваш бот → Bot Settings → Menu Button → Configure
   - Введите production URL
5. **Обновите webhook ЮКасса** на production URL

---

## 🔧 Полезные команды

### Для разработки

```bash
# Терминал 1: Запуск Next.js
npm run dev

# Терминал 2: Запуск ngrok (с фиксированным доменом)
ngrok http 3000 --domain=volleydzen-dev.ngrok.io
```

### Проверка переменных окружения

```bash
# Проверьте что все переменные на месте
cat .env.local
```

---

## 🐛 Частые проблемы

### 1. "Telegram WebApp SDK не найден"

**В браузере** - это нормально. Используются mock данные.

**В Telegram** - проверьте что:
- Script `https://telegram.org/js/telegram-web-app.js` загружается
- Приложение открывается через Menu Button в боте

### 2. ngrok URL меняется при перезапуске

**Решение**: Используйте Static Domain (см. раздел 2️⃣)

### 3. initData validation failed

**Причины**:
- Истёк срок действия initData (более 1 часа)
- Неверный TELEGRAM_BOT_TOKEN
- Приложение открыто не через Telegram

**Решение**:
- Закройте и откройте Mini App заново
- Проверьте токен в .env.local
- Убедитесь что открываете через бота

### 4. Платежи не работают

**Проверьте**:
- YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY правильные
- Магазин привязан к боту в личном кабинете ЮКасса
- Используете тестовый режим для тестовых платежей
- Сумма платежа не меньше минимальной (обычно 1 рубль)

---

## 📚 Дополнительные ресурсы

### Официальная документация

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ЮKassa для Telegram](https://yookassa.ru/docs/support/payments/onboarding/integration/cms-module/telegram)
- [ЮКасса API](https://yookassa.ru/developers/api)

### Примеры кода

```typescript
// Получение данных пользователя
const { user } = useTelegram()
console.log(user?.id, user?.first_name)

// Показ кнопки "Назад"
useEffect(() => {
  if (webApp?.BackButton) {
    webApp.BackButton.show()
    webApp.BackButton.onClick(() => router.back())
  }
}, [])

// Показ главной кнопки
useEffect(() => {
  if (webApp?.MainButton) {
    webApp.MainButton.setText('Записаться на кэмп')
    webApp.MainButton.show()
    webApp.MainButton.onClick(handleBooking)
  }
}, [])

// Haptic Feedback (вибрация)
webApp?.HapticFeedback.impactOccurred('medium')
webApp?.HapticFeedback.notificationOccurred('success')
```

---

## ✅ Чеклист готовности к запуску

- [ ] Бот создан через @BotFather
- [ ] TELEGRAM_BOT_TOKEN добавлен в .env.local
- [ ] ngrok установлен и настроен
- [ ] Static domain создан (или готовы обновлять URL)
- [ ] Menu Button настроена в боте
- [ ] Mini App открывается в Telegram
- [ ] ЮКасса подключена к магазину
- [ ] YOOKASSA_SHOP_ID и SECRET_KEY в .env.local
- [ ] Тестовые платежи проходят
- [ ] Webhook настроен (для production)

---

**Готово! Mini App настроен и готов к разработке! 🚀**
