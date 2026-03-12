import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { phone, email, playLevel } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userPayload.sub as string },
      data: {
        phone,
        email,
        playLevel,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: userPayload.sub as string },
        include: {
            bookings: { include: { camp: true } },
            userCourses: { include: { course: true } },
            ensoLevel: true,
        }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const safeUser = {
      ...user,
      telegramId: user.telegramId?.toString(),
    };

    return NextResponse.json(safeUser);
}
