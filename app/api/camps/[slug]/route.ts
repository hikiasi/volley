import { NextRequest, NextResponse } from "next/server";
import { getCampBySlug } from "@/lib/camps";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const camp = await getCampBySlug(params.slug);

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    return NextResponse.json(camp);
  } catch (error: unknown) {
    console.error(`Error fetching camp ${params.slug}:`, error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch camp details" },
      { status: 500 }
    );
  }
}
