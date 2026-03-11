import { prisma } from "@/lib/db";

export async function createBooking(userId: string, campId: string, paymentType: 'full' | 'deposit') {
  const camp = await prisma.camp.findUnique({
    where: { id: campId },
  });

  if (!camp) throw new Error("Camp not found");
  if (camp.currentParticipants >= camp.maxParticipants) throw new Error("Camp is full");

  const totalAmount = camp.basePrice;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  return await prisma.booking.create({
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
}
