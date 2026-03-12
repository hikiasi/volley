import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createYookassaPayment } from "@/lib/yookassa";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { paymentType, promoCodeId, selectedDayIds } = body as {
      paymentType: "full" | "deposit" | "installment",
      promoCodeId?: string,
      selectedDayIds?: string[]
    };

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
    });

    if (!camp) return NextResponse.json({ error: "Camp not found" }, { status: 404 });

    // Calculate final amount
    let totalAmount = camp.basePrice;

    if (promoCodeId) {
      const promo = await prisma.promoCode.findUnique({ where: { id: promoCodeId } });
      if (promo && promo.isActive) {
        if (promo.discountType === "percentage") {
          totalAmount = totalAmount * (1 - promo.discountValue / 100);
        } else {
          totalAmount = Math.max(0, totalAmount - promo.discountValue);
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.sub as string,
        campId: camp.id,
        status: "pre_booked",
        paymentType,
        baseAmount: camp.basePrice,
        totalAmount: Math.round(totalAmount),
        selectedDayIds: selectedDayIds || [],
        preBookedAt: new Date(),
        preBookExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const payment = await createYookassaPayment({
      amount: booking.totalAmount,
      description: `Оплата кэмпа ${camp.title} (${camp.city})`,
      metadata: { booking_id: booking.id, user_id: user.sub as string },
      returnUrl: `${process.env.YOOKASSA_RETURN_URL || "https://volleydzen.ru/payment/success"}`,
      paymentType,
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: user.sub as string,
        yookassaPaymentId: payment.id,
        amount: booking.totalAmount,
        currency: "RUB",
        status: "pending",
        confirmationUrl: payment.confirmation.confirmation_url,
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      paymentUrl: payment.confirmation.confirmation_url,
    });
  } catch (error: unknown) {
    console.error("Booking Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
