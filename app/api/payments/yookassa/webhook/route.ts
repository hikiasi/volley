import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isYookassaIP } from "@/lib/yookassa";
import { sendTelegramMessage } from "@/lib/notifications";
import { generateAndUploadReceipt } from "@/lib/pdf";
import { generateCampICS } from "@/lib/calendar";
import { uploadToS3 } from "@/lib/pdf";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "";
    if (!isYookassaIP(ip)) {
      console.warn(`Blocked webhook from unauthorized IP: ${ip}`);
      // return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { event, object } = await req.json();

    if (event === "payment.succeeded") {
      const { id: yookassaId, metadata, amount } = object;

      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { yookassaPaymentId: yookassaId },
          data: { status: "succeeded", capturedAt: new Date() },
          include: { user: true },
        });

        if (metadata.booking_id) {
          const booking = await tx.booking.update({
            where: { id: metadata.booking_id },
            data: {
              status: "fully_paid",
              paidAmount: Math.round(parseFloat(amount.value) * 100)
            },
            include: { camp: true },
          });

          return { payment, booking };
        }

        if (metadata.course_id) {
           const userCourse = await tx.userCourse.create({
              data: {
                userId: metadata.user_id,
                courseId: metadata.course_id,
                status: "active",
              }
           });
           return { payment, userCourse };
        }

        return { payment };
      });

      // Post-payment success: Trigger notifications & PDF
      if ('booking' in result && result.booking) {
        try {
          const receiptUrl = await generateAndUploadReceipt(result.booking.id);
          await prisma.booking.update({
            where: { id: result.booking.id },
            data: { receiptUrl },
          });

          if (result.payment.user.telegramId) {
            // Generate .ics for calendar
            const icsBuffer = generateCampICS({
              title: result.booking.camp.title,
              startDate: result.booking.camp.startDate,
              endDate: result.booking.camp.endDate,
              address: result.booking.camp.address,
              city: result.booking.camp.city
            });
            const icsUrl = await uploadToS3(`calendars/${result.booking.id}.ics`, icsBuffer, "text/calendar");

            await sendTelegramMessage(
              result.payment.user.telegramId.toString(),
              `🎉 Оплата прошла успешно! Вы участник кэмпа <b>${result.booking.camp.title}</b>.\n\n📍 Адрес: ${result.booking.camp.address || result.booking.camp.city}\n📅 Дата: ${result.booking.camp.startDate.toLocaleDateString('ru-RU')}`,
              [
                { text: "🧾 Квитанция PDF", url: receiptUrl },
                { text: "📅 В календарь .ics", url: icsUrl },
                { text: "💬 Чат участников", url: result.booking.camp.participantsChatUrl || "https://t.me/volleydzen" }
              ]
            );
          }
        } catch (postError) {
          console.error("Post-payment action error:", postError);
          // Still return ok to Yookassa
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Webhook Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
