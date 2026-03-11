import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

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

    // Auto-registration as per Section 4.4 of the TZ
    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(telegramUser.id),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          photoUrl: telegramUser.photo_url,
          role: "user",
        },
      });
    } else {
      // Update info if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          photoUrl: telegramUser.photo_url,
          lastActiveAt: new Date(),
        },
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        telegramId: user.telegramId.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"] }
    );

    const response = NextResponse.json({ token, user: { ...user, telegramId: user.telegramId.toString() } });
    response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
