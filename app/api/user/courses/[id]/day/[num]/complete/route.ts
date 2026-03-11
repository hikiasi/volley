import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from 'jose';

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; num: string } }
) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { rpe } = body;

    const userCourse = await prisma.userCourse.findFirst({
        where: { userId: userPayload.sub as string, courseId: params.id }
    });

    if (!userCourse) return NextResponse.json({ error: "Course not purchased" }, { status: 403 });

    // Find the day ID
    const courseDay = await prisma.courseDay.findFirst({
        where: {
            week: { courseId: params.id },
            dayNumber: parseInt(params.num)
        }
    });

    if (!courseDay) return NextResponse.json({ error: "Day not found" }, { status: 404 });

    const progress = await prisma.userDayProgress.upsert({
      where: {
        userCourseId_courseDayId: {
          userCourseId: userCourse.id,
          courseDayId: courseDay.id,
        },
      },
      update: {
        isCompleted: true,
        rpe: rpe,
        completedAt: new Date(),
      },
      create: {
        userCourseId: userCourse.id,
        courseDayId: courseDay.id,
        isCompleted: true,
        rpe: rpe,
        completedAt: new Date(),
      },
    });

    // Update UserCourse progress percentage (simplified)
    const totalDays = await prisma.courseDay.count({
        where: { week: { courseId: params.id } }
    });
    const completedDays = await prisma.userDayProgress.count({
        where: { userCourseId: userCourse.id, isCompleted: true }
    });

    await prisma.userCourse.update({
        where: { id: userCourse.id },
        data: {
            progress: Math.round((completedDays / totalDays) * 100),
            lastActivityAt: new Date(),
            currentDay: parseInt(params.num) + 1 // increment for next time
        }
    });

    return NextResponse.json(progress);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
