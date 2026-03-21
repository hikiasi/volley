import { NextResponse } from "next/server";
import { cancelExpiredBookings } from "@/lib/bookings";

export async function GET() {
  try {
    const cancelledCount = await cancelExpiredBookings();
    return NextResponse.json({ cancelledCount });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
