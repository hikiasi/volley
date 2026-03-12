import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

async function isAdmin(req: NextRequest) {
  const payload = await getUserFromRequest(req);
  return payload?.role === 'admin';
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const camps = await prisma.camp.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { startDate: 'desc' }
  });
  return NextResponse.json(camps);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const camp = await prisma.camp.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        // Ensure decimal conversion if needed
      }
    });
    return NextResponse.json(camp);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
