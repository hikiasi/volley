export async function sendTelegramMessage(
  telegramId: string | number,
  text: string,
  buttons?: Array<{ text: string; url?: string; callback_data?: string }>
) {
  const payload: {
    chat_id: string | number;
    text: string;
    parse_mode: string;
    reply_markup?: {
      inline_keyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>>;
    };
  } = {
    chat_id: telegramId,
    text,
    parse_mode: "HTML",
  };

  if (buttons?.length) {
    payload.reply_markup = {
      inline_keyboard: [
        buttons.map((b) => ({
          text: b.text,
          ...(b.url ? { url: b.url } : { callback_data: b.callback_data }),
        })),
      ],
    };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Telegram API Error:", error);
    throw new Error(`Telegram API Error: ${error.description}`);
  }

  return response.json();
}
