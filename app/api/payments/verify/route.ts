import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getYookassaPaymentStatus } from "@/lib/yookassa";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { 
        bookingId: bookingId,
        status: "pending" // We only care about verifying pending payments
      },
    });

    if (!payment || !payment.yookassaPaymentId) {
      // It's possible the payment was already verified, so check the final booking status
      const booking = await prisma.booking.findUnique({ 
        where: { id: bookingId },
        include: { camp: true } 
      });
      if (booking && (booking.status === 'fully_paid' || booking.status === 'deposit_paid')) {
        const successfulPayment = await prisma.payment.findFirst({
            where: { bookingId: bookingId, status: 'succeeded' },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ status: "succeeded", booking: booking, paymentId: successfulPayment?.id });
      }
      return NextResponse.json({ error: "Pending payment not found for this booking." }, { status: 404 });
    }

    const yookassaStatus = await getYookassaPaymentStatus(payment.yookassaPaymentId);

    if (yookassaStatus.status === 'succeeded') {
      // This is the same logic that was in the webhook handler
      const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: { status: "succeeded", capturedAt: new Date() },
          include: { user: true },
        });

        const existingBooking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { camp: true }
        });

        if (!existingBooking) {
           console.warn(`⚠️ Verification: Booking not found for booking_id: ${bookingId}. Payment status will be updated, but booking will not.`);
           return { payment: updatedPayment, booking: null };
        }
        
        const totalPaid = existingBooking.paidAmount + updatedPayment.amount;
        const newStatus = totalPaid >= existingBooking.totalAmount ? "fully_paid" : "deposit_paid";

        const booking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: newStatus,
            paidAmount: totalPaid,
            remainingAmount: Math.max(0, existingBooking.totalAmount - totalPaid)
          },
          include: { camp: true },
        });

        return { payment: updatedPayment, booking };
      });
      
      // Optional: Send notification
      if (result.booking) {
        await sendNotification(
          result.payment.user,
          `Оплата кэмпа ${result.booking.camp.title} подтверждена!`,
          `🎉 Оплата кэмпа <b>${result.booking.camp.title}</b> успешно подтверждена!`
        );
      }

      return NextResponse.json({ status: "succeeded", booking: result.booking, paymentId: result.payment.id });
    }

    // If status is not 'succeeded' (e.g., 'pending', 'canceled')
    return NextResponse.json({ status: yookassaStatus.status });

  } catch (error: unknown) {
    console.error("Payment Verification Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
