import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; num: string } }
) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { videoUrl, userComment, rpe } = body;

    const userCourse = await prisma.userCourse.findFirst({
        where: { userId: userPayload.sub as string, courseId: params.id },
        include: { course: true }
    });

    if (!userCourse) return NextResponse.json({ error: "Course not purchased" }, { status: 403 });

    const courseDay = await prisma.courseDay.findFirst({
        where: {
            week: { courseId: params.id },
            dayNumber: parseInt(params.num)
        }
    });

    if (!courseDay) return NextResponse.json({ error: "Day not found" }, { status: 404 });

    const review = await prisma.videoReview.create({
      data: {
        userId: userPayload.sub as string,
        trainerId: userCourse.course.trainerId || "", // Should be handled better
        userCourseId: userCourse.id,
        courseDayId: courseDay.id,
        videoUrl,
        userComment,
        rpe,
        status: "pending",
      },
    });

    return NextResponse.json(review);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
