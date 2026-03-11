import { prisma } from "@/lib/db";

export async function createBooking(userId: string, campId: string, paymentType: 'full' | 'deposit') {
  const camp = await prisma.camp.findUnique({
    where: { id: campId },
  });

  if (!camp) throw new Error("Camp not found");
  if (camp.currentParticipants >= camp.maxParticipants) {
    // Check if waitlist is full or disabled
    throw new Error("Camp is full");
  }

  // Transactionally create booking and increment participant count
  return await prisma.$transaction(async (tx) => {
    const updatedCamp = await tx.camp.update({
      where: { id: campId },
      data: { currentParticipants: { increment: 1 } },
    });

    if (updatedCamp.currentParticipants > updatedCamp.maxParticipants) {
      throw new Error("Camp reached capacity while processing");
    }

    const totalAmount = camp.basePrice;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return await tx.booking.create({
      data: {
        userId,
        campId,
        status: "pre_booked",
        paymentType,
        baseAmount: camp.basePrice,
        totalAmount,
        preBookedAt: new Date(),
        preBookExpiresAt: expiresAt,
      },
    });
  });
}

export async function cancelExpiredBookings() {
  const now = new Date();
  const expired = await prisma.booking.findMany({
    where: {
      status: "pre_booked",
      preBookExpiresAt: { lt: now },
    },
  });

  for (const booking of expired) {
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { status: "cancelled" },
      }),
      prisma.camp.update({
        where: { id: booking.campId },
        data: { currentParticipants: { decrement: 1 } },
      }),
    ]);
  }

  return expired.length;
}
