import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function getUserFromRequest(req: NextRequest) {
  // 1. Try Authorization Header
  const authHeader = req.headers.get("authorization");
  let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // 2. Try Cookie if no header
  if (!token) {
    token = req.cookies.get("auth_token")?.value || null;
  }

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    console.error("JWT Verify Error:", e);
    return null;
  }
}
