import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    });

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    const waitlistEntry = await prisma.waitlistEntry.findUnique({
      where: {
        userId_campId: {
          userId: user.sub as string,
          campId: camp.id
        }
      }
    });

    return NextResponse.json({ entry: waitlistEntry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
      select: { id: true, currentParticipants: true, maxParticipants: true }
    });

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    // Check if user is already in waitlist
    const existing = await prisma.waitlistEntry.findUnique({
      where: {
        userId_campId: {
          userId: user.sub as string,
          campId: camp.id
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Already in waitlist" }, { status: 400 });
    }

    // Get current max position
    const lastEntry = await prisma.waitlistEntry.findFirst({
      where: { campId: camp.id },
      orderBy: { position: 'desc' }
    });

    const nextPosition = (lastEntry?.position || 0) + 1;

    const entry = await prisma.waitlistEntry.create({
      data: {
        userId: user.sub as string,
        campId: camp.id,
        position: nextPosition
      }
    });

    return NextResponse.json(entry);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const camp = await prisma.camp.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    });

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    await prisma.waitlistEntry.delete({
      where: {
        userId_campId: {
          userId: user.sub as string,
          campId: camp.id
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
