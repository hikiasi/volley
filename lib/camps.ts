import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export async function getCamps(filters: {
  city?: string;
  status?: "published" | "full" | "completed";
  level?: string;
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc";
}) {
  const where: Prisma.CampWhereInput = {};
  if (filters.city) where.city = filters.city;
  if (filters.status) where.status = filters.status;
  if (filters.level) where.level = { contains: filters.level };

  const orderBy: Prisma.CampOrderByWithRelationInput = {};
  if (filters.sortBy === 'date_asc') orderBy.startDate = 'asc';
  else if (filters.sortBy === 'date_desc') orderBy.startDate = 'desc';
  else if (filters.sortBy === 'price_asc') orderBy.basePrice = 'asc';
  else if (filters.sortBy === 'price_desc') orderBy.basePrice = 'desc';
  else orderBy.startDate = 'asc';


  const camps = await prisma.camp.findMany({
    where,
    orderBy,
    // Explicitly select all fields needed by components
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      level: true,
      startDate: true,
      basePrice: true,
      maxParticipants: true,
      currentParticipants: true,
      coverImageUrl: true,
      hotMessage: true,
      earlyBirdPrice: true,
      earlyBirdCutoff: true,
      status: true,
      trainers: {
        select: {
          trainer: true,
        },
      },
    },
  });
  return camps;
}

export async function getCampBySlug(slug: string) {
  const camp = await prisma.camp.findUnique({
    where: { slug },
    // Explicitly select all fields needed by components
    select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        level: true,
        city: true,
        startDate: true,
        endDate: true,
        basePrice: true,
        maxParticipants: true,
        currentParticipants: true,
        coverImageUrl: true,
        whatsIncluded: true,
        customSections: true,
        earlyBirdPrice: true,
        earlyBirdCutoff: true,
        status: true,
        trainers: {
            select: {
              trainer: true,
            },
        },
        days: {
            orderBy: {
                dayNumber: 'asc'
            }
        },
    },
  });
  return camp;
}

export async function getNearestUpcomingCamp() {
    const camp = await prisma.camp.findFirst({
        where: {
            status: 'published',
            startDate: {
                gte: new Date()
            }
        },
        orderBy: {
            startDate: 'asc'
        },
        // Explicitly select all fields needed by components
        select: {
            id: true,
            slug: true,
            city: true,
            startDate: true,
            maxParticipants: true,
            currentParticipants: true,
        }
    });
    return camp;
}

export async function getUniqueCampCities() {
  const cities = await prisma.camp.findMany({
    where: {
      status: 'published',
    },
    select: {
      city: true,
    },
    distinct: ['city'],
  });
  return cities.map(c => c.city);
}
