import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const city = searchParams.get("city");

  try {
    const where: any = {};
    if (status) where.status = status;
    if (city) where.city = city;

    const camps = await prisma.camp.findMany({
      where,
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(camps);
  } catch (error) {
    console.error("API Camps Error:", error);
    return NextResponse.json({ error: "Failed to fetch camps" }, { status: 500 });
  }
}
