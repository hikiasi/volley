import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createYookassaPayment } from "@/lib/yookassa";
import { getUserFromRequest } from "@/lib/auth";
import { sendNotification } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch the full user object from DB to get email/phone for the receipt
    const user = await prisma.user.findUnique({ where: { id: userPayload.sub as string }});
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { paymentType, promoCodeId, selectedDayIds, pdpConsent, waiverConsent } = body as {
      paymentType: "full" | "deposit" | "installment",
      promoCodeId?: string,
      selectedDayIds?: string[],
      pdpConsent: boolean,
      waiverConsent: boolean
    };

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
    });

    if (!camp) return NextResponse.json({ error: "Camp not found" }, { status: 404 });

    // Calculate final amount
    let totalAmount = paymentType === 'deposit' ? (camp.depositAmount || camp.basePrice) : camp.basePrice;

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

    // Use a transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Check for any existing active booking for this user and camp
      const existingBooking = await tx.booking.findFirst({
        where: {
          userId: user.id,
          campId: camp.id,
          status: { in: ['deposit_paid', 'fully_paid', 'pre_booked'] }
        }
      });

      if (existingBooking && existingBooking.status !== 'pre_booked') {
        throw new Error("У вас уже есть подтвержденная бронь на этот кэмп.");
      }
      
      let finalBooking = existingBooking;

      // 2. If no booking exists, create a new one and increment participant count
      if (!existingBooking) {
        const updatedCamp = await tx.camp.update({
          where: { id: camp.id },
          data: { currentParticipants: { increment: 1 } }
        });

        if (updatedCamp.currentParticipants > updatedCamp.maxParticipants) {
          throw new Error("К сожалению, места в кэмпе закончились.");
        }

        finalBooking = await tx.booking.create({
          data: {
            userId: user.id,
            campId: camp.id,
            status: "pre_booked",
            paymentType,
            baseAmount: camp.basePrice,
            totalAmount: Math.round(totalAmount),
            selectedDayIds: selectedDayIds || [],
            preBookedAt: new Date(),
            preBookExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24h
            pdpConsent,
            waiverConsent,
          },
        });
      }

      if (!finalBooking) {
        throw new Error("Не удалось создать или найти бронирование.");
      }
      
      return finalBooking;
    });

    const payment = await createYookassaPayment({
      amount: booking.totalAmount,
      description: `Оплата кэмпа ${camp.title} (${camp.city})`,
      metadata: { booking_id: booking.id, user_id: user.id },
      bookingId: booking.id,
      paymentType,
      user: user,
      campTitle: camp.title,
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        yookassaPaymentId: payment.id,
        amount: booking.totalAmount,
        currency: "RUB",
        status: "pending",
        confirmationUrl: payment.confirmation.confirmation_url,
      },
    });

    // Send notification to user
    await sendNotification(
      user,
      `Счет на оплату кэмпа ${camp.title}`,
      `🧾 Создан счет для оплаты кэмпа <b>${camp.title}</b>. Завершите оплату, чтобы подтвердить бронирование.`
    );

    return NextResponse.json({
      bookingId: booking.id,
      confirmationUrl: payment.confirmation.confirmation_url,
    });
  } catch (error: unknown) {
    console.error("Booking Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
