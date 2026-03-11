import { prisma } from "@/lib/db";
import { CourseCategory } from "@prisma/client";

export async function getCourses(category?: CourseCategory) {
  return await prisma.course.findMany({
    where: {
      status: "published",
      ...(category ? { category } : {}),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return await prisma.course.findUnique({
    where: { slug },
    include: {
      weeks: {
        include: {
          days: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
                orderBy: {
                  orderIndex: "asc",
                },
              },
            },
            orderBy: {
              dayNumber: "asc",
            },
          },
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
      trainer: true,
    },
  });
}
