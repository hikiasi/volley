import crypto from "crypto";
import type { User } from "@prisma/client";

export async function createYookassaPayment(params: {
  amount: number; // in kopeks
  description: string;
  metadata: Record<string, string | number | boolean>;
  bookingId: string;
  paymentType: "full" | "deposit" | "installment";
  user: Partial<User>; // User object for receipt
  campTitle: string;
}) {
  const returnUrl = `${process.env.YOOKASSA_RETURN_URL || "https://volleydzen.ru/payment/success"}?booking_id=${params.bookingId}`;
  
  // Clean phone number for YooKassa API (they expect digits only)
  const cleanPhone = params.user.phone ? params.user.phone.replace(/\D/g, '') : null;

  const body: {
    amount: { value: string; currency: string };
    confirmation: { type: string; return_url: string };
    description: string;
    metadata: Record<string, string | number | boolean>;
    capture: boolean;
    receipt: {
      customer: {
        email?: string | null;
        phone?: string | null;
      };
      items: {
        description: string;
        quantity: string;
        amount: {
          value: string;
          currency: string;
        };
        vat_code: string;
      }[];
    };
    payment_method_data?: { type: string };
  } = {
    amount: { value: (params.amount / 100).toFixed(2), currency: "RUB" },
    confirmation: { type: "redirect", return_url: returnUrl },
    description: params.description,
    metadata: params.metadata,
    capture: true,
    receipt: {
      customer: {
        email: params.user.email,
        phone: cleanPhone,
      },
      items: [
        {
          description: params.campTitle,
          quantity: "1.00",
          amount: {
            value: (params.amount / 100).toFixed(2),
            currency: "RUB",
          },
          vat_code: "1", // VAT code for "no VAT"
        },
      ],
    },
  };

  if (params.paymentType === "installment") {
    body.payment_method_data = { type: "installments" };
  }

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": crypto.randomUUID(),
      "Authorization": "Basic " + Buffer.from(
        `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
      ).toString("base64"),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Yookassa API Error:", error);
    throw new Error(`Yookassa API Error: ${error.description || error.message}`);
  }

  return response.json();
}

export async function getYookassaPaymentStatus(yookassaPaymentId: string) {
  const response = await fetch(`https://api.yookassa.ru/v3/payments/${yookassaPaymentId}`, {
    method: "GET",
    headers: {
      "Authorization": "Basic " + Buffer.from(
        `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
      ).toString("base64"),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Yookassa GetStatus API Error:", error);
    throw new Error(`Yookassa GetStatus API Error: ${error.description || error.message}`);
  }

  return response.json();
}

export function isYookassaIP(ip: string): boolean {
  const whitelist = (process.env.YOOKASSA_WEBHOOK_IP_WHITELIST || "185.71.76.0/27,185.71.77.0/27").split(",");
  // Improved IP check for MVP: Validate first three octets for common YooKassa ranges
  return whitelist.some(range => {
    const parts = range.split(".");
    const prefix = parts.slice(0, 3).join(".");
    return ip.startsWith(prefix + ".");
  });
}
