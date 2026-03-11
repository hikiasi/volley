import { NextResponse } from "next/server";
import { cancelExpiredBookings } from "@/lib/bookings";

export async function GET() {
  try {
    const cancelledCount = await cancelExpiredBookings();
    return NextResponse.json({ cancelledCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
