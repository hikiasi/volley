import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram";
import { prisma } from "@/lib/db";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();

    if (!initData) {
      return NextResponse.json({ error: "No initData provided" }, { status: 400 });
    }

    const telegramUser = validateTelegramInitData(initData);

    if (!telegramUser) {
      return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
    }

    const telegramId = BigInt(telegramUser.id);

    // Auto-registration logic
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photoUrl: telegramUser.photo_url,
        lastActiveAt: new Date(),
      },
      create: {
        telegramId,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photoUrl: telegramUser.photo_url,
        role: "user",
      },
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
        sub: user.id,
        telegramId: user.telegramId?.toString(),
        role: user.role
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
      .sign(secret);

    const safeUser = {
      ...user,
      telegramId: user.telegramId?.toString(),
    };

    const response = NextResponse.json({ token, user: safeUser });

    // Calculate expiration in seconds for cookie (7 days)
    const maxAge = 7 * 24 * 60 * 60;

    response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: true, // Required for many Mini App contexts
        sameSite: "none", // Required for cross-site (Telegram -> App)
        path: "/",
        maxAge: maxAge
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
