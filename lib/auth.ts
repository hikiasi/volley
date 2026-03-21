import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import crypto from "crypto";
import { prisma } from "@/lib/db";

async function getAndValidateTmaUser(initData: string): Promise<any | null> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        console.error("TELEGRAM_BOT_TOKEN is not set");
        return null;
    }

    try {
        const params = new URLSearchParams(initData);
        const hash = params.get("hash");
        params.delete("hash");

        const dataCheckString = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join("\n");
            
        const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
        const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

        if (calculatedHash !== hash) {
            console.warn("TMA initData hash validation failed");
            return null;
        }

        const userData = JSON.parse(params.get("user") || "{}");
        if (!userData.id) {
            console.warn("User data not found in initData");
            return null;
        }
        
        const telegramId = BigInt(userData.id);

        const dbUser = await prisma.user.upsert({
            where: { telegramId },
            update: {
                firstName: userData.first_name,
                lastName: userData.last_name || null,
                username: userData.username || null,
                photoUrl: userData.photo_url || null,
                lastActiveAt: new Date(),
            },
            create: {
                telegramId,
                firstName: userData.first_name,
                lastName: userData.last_name || null,
                username: userData.username || null,
                photoUrl: userData.photo_url || null,
            }
        });

        return {
            sub: dbUser.id,
            telegramId: dbUser.telegramId,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            username: dbUser.username,
            role: dbUser.role,
        };
    } catch(e) {
        console.error("Error during TMA user validation/provisioning:", e);
        return null;
    }
}


export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("tma ")) {
    const initData = authHeader.split(" ")[1];
    if (initData) {
        const tmaUser = await getAndValidateTmaUser(initData);
        if (tmaUser) return tmaUser;
    }
  }

  let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // 3. Try Cookie if no header token
  if (!token) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
      token = cookies['auth_token'] || null;
    }
  }
  
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}
