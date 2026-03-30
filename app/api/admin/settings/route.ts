import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// GET all settings
export async function GET(req: NextRequest) {
    try {
        const settings = await prisma.setting.findMany();
        // Convert array to a key-value object for easier use on the client
        const settingsObj = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, any>);
        return NextResponse.json(settingsObj);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// PATCH (update) settings
export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body: Record<string, any> = await req.json();

        // Update each setting in a transaction
        await prisma.$transaction(
            Object.entries(body).map(([key, value]) => 
                prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                })
            )
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
