import { Resend } from 'resend';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'VolleyDzen <noreply@volleydzen.ru>', // You might need to configure this domain in Resend
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }
    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

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

export async function sendNotification(user: { telegramId?: bigint | null, email?: string | null }, subject: string, message: string) {
    if (user.telegramId) {
        await sendTelegramMessage(user.telegramId.toString(), message);
    } else if (user.email) {
        await sendEmail({ to: user.email, subject: subject, html: `<p>${message.replace(/\n/g, "<br>")}</p>` });
    } else {
        console.warn(`User with ID ${'id' in user ? (user as any).id : ''} has no telegramId or email to send notification.`);
    }
}
