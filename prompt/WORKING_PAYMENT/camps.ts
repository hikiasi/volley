import { prisma } from "@/lib/db";

export async function getCamps() {
  return await prisma.camp.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      startDate: "asc",
    },
  });
}

export async function getCampBySlug(slug: string) {
  return await prisma.camp.findUnique({
    where: { slug },
    include: {
      trainers: {
        include: {
          trainer: true,
        },
      },
      days: {
        include: {
          options: true,
        },
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
  });
}
