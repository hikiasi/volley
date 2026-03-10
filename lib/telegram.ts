import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

/**
 * Validates Telegram initData using HMAC-SHA256 as per Section 4.3 of the TZ.
 */
export function validateTelegramInitData(initData: string): TelegramUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const expectedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (expectedHash !== hash) return null;

  // Check if initData is not older than 1 hour
  const authDate = parseInt(params.get("auth_date") || "0");
  if (Date.now() / 1000 - authDate > 3600) return null;

  try {
    return JSON.parse(params.get("user") || "null");
  } catch {
    return null;
  }
}
