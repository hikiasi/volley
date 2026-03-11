import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBooking } from "@/lib/bookings";
import { sendTelegramMessage } from "@/lib/notifications";

import { jwtVerify } from "jose";

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
    });

    if (!camp) return NextResponse.json({ error: "Camp not found" }, { status: 404 });

    const booking = await createBooking(user.sub as string, camp.id, "full");

    // Send Telegram notification
    const expiresAt = booking.preBookExpiresAt?.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    await sendTelegramMessage(
      user.telegramId as number,
      `✅ Место в кэмпе ${camp.title} (${camp.city}) забронировано на 24 часа! Оплатите до ${expiresAt} чтобы подтвердить участие.`
    );

    return NextResponse.json({
      bookingId: booking.id,
      expiresAt: booking.preBookExpiresAt,
    });
  } catch (error: unknown) {
    console.error("Pre-book Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
