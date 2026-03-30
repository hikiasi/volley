import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findFirst({ 
        where: { email },
        select: {
            id: true,
            password: true,
            role: true,
            email: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
        }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
      .sign(secret);

    // Create a user object for the response, omitting the password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      token,
      user: userWithoutPassword
    });

    // Calculate expiration in seconds for cookie (7 days)
    const maxAge = 7 * 24 * 60 * 60;

    response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: maxAge
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
