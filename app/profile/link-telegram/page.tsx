"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LinkTelegramPage() {
  const [telegramData, setTelegramData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Make the onTelegramAuth function available globally
    (window as any).onTelegramAuth = (user: any) => {
      setTelegramData(user);
    };

    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME!);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    const widgetContainer = document.getElementById('telegram-login-widget');
    if (widgetContainer) {
        widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && widgetContainer.contains(script)) {
        widgetContainer.removeChild(script);
      }
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const handleLinkAccount = async () => {
    if (!telegramData) {
      setError("Please log in with Telegram first.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/user/profile/link-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: telegramData }),
      });

      if (res.ok) {
        alert("Аккаунт Telegram успешно привязан!");
        router.push('/profile');
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Не удалось привязать аккаунт.");
      }
    } catch (e) {
      setError("Произошла сетевая ошибка.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Привязка Telegram</h1>
      <p className="text-sm text-gray-400 mb-6">
        Войдите через Telegram, чтобы привязать ваш аккаунт и получать уведомления о бронированиях.
      </p>

      <div id="telegram-login-widget" className="mb-6"></div>

      {telegramData && (
        <div className="space-y-4">
            <p className="text-sm text-green-400">Вы успешно вошли как <b>{(telegramData as any).first_name}</b>. Нажмите, чтобы завершить привязку.</p>
            <button
                onClick={handleLinkAccount}
                disabled={isSubmitting}
                className="w-full bg-v-accent text-white h-12 rounded-lg font-bold uppercase text-sm tracking-widest disabled:opacity-50"
            >
                {isSubmitting ? "Привязка..." : "Привязать аккаунт"}
            </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-4 text-xs text-gray-500">
        Убедитесь, что ваш бот (`@{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`) настроен для домена, на котором запущено это приложение.
      </div>
    </div>
  );
}
