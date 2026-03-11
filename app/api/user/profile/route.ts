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
        }
    });

    return NextResponse.json(user);
}
