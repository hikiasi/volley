import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

async function isAdmin(req: NextRequest) {
  const payload = await getUserFromRequest(req);
  return payload?.role === 'admin';
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await prisma.course.findMany({
    include: { trainer: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const course = await prisma.course.create({
      data: body
    });
    return NextResponse.json(course);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
