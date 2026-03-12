import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status") || "published";

  try {
    const where: Record<string, string> = { status };
    if (category && category !== 'all') {
      where.category = category;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("API Courses Error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
