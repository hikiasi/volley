import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { validateTelegramInitData } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the existing web user via JWT cookie
    const webUser = await getUserFromRequest(req);
    if (!webUser || !webUser.sub) {
      return NextResponse.json({ error: "Unauthorized: You must be logged in to link an account." }, { status: 401 });
    }

    const { initData } = await req.json();
    if (!initData) {
      return NextResponse.json({ error: "initData is required." }, { status: 400 });
    }

    // 2. Validate the new Telegram initData
    const telegramUser = validateTelegramInitData(initData);
    if (!telegramUser) {
      return NextResponse.json({ error: "Invalid Telegram data." }, { status: 401 });
    }

    const telegramId = BigInt(telegramUser.id);

    // 3. Check if this Telegram account is already linked to another user
    const existingTelegramLink = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (existingTelegramLink && existingTelegramLink.id !== webUser.sub) {
      return NextResponse.json({ error: "This Telegram account is already linked to another user." }, { status: 409 });
    }

    // 4. Update the logged-in user's record with the new Telegram details
    const updatedUser = await prisma.user.update({
      where: { id: webUser.sub as string },
      data: {
        telegramId: telegramId,
        // Optionally update user's name/photo from their Telegram profile
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photoUrl: telegramUser.photo_url || null,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error: any) {
    console.error("Link Telegram Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
