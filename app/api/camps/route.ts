import { NextRequest, NextResponse } from "next/server";
import { getCamps } from "@/lib/camps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      city: searchParams.get("city") || undefined,
      status: (searchParams.get("status") as "published" | "full" | "completed") || undefined,
      level: searchParams.get("level") || undefined,
      sortBy: (searchParams.get("sortBy") as "date_asc" | "date_desc" | "price_asc" | "price_desc") || 'date_asc',
    };

    const camps = await getCamps(filters);
    return NextResponse.json(camps);
  } catch (error) {
    console.error("Error fetching camps:", error);
    return NextResponse.json(
      { error: "Failed to fetch camps" },
      { status: 500 }
    );
  }
}
