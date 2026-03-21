import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBooking } from "@/lib/bookings";
import { sendNotification } from "@/lib/notifications";
import { getUserFromRequest } from "@/lib/auth";

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

    // We need the full user object to get their email if needed
    const fullUser = await prisma.user.findUnique({ where: { id: user.sub as string }});
    if (!fullUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    const booking = await createBooking(user.sub as string, camp.id, "full");

    // Send Telegram notification
    const expiresAt = booking.preBookExpiresAt?.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    await sendNotification(
      fullUser,
      `Предбронь на кэмп ${camp.title}`,
      `✅ Место в кэмпе ${camp.title} (${camp.city}) забронировано на 24 часа! Оплатите до ${expiresAt} чтобы подтвердить участие.`
    );

    return NextResponse.json({
      bookingId: booking.id,
      expiresAt: booking.preBookExpiresAt,
    });
  } catch (error: unknown) {
    console.error("Pre-book Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("You already have an active booking for this camp")) {
        return NextResponse.json({ error: "У вас уже есть активная бронь или заявка на этот кэмп." }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
