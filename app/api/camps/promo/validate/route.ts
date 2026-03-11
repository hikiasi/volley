import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, campId } = await req.json();

    const promo = await prisma.promoCode.findFirst({
      where: {
        code: { equals: code, mode: "insensitive" },
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!promo) {
      return NextResponse.json({ error: "Промокод не найден или истек" }, { status: 404 });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: "Промокод использован максимальное количество раз" }, { status: 400 });
    }

    if (promo.applicableTo !== "all" && promo.applicableTo !== "camps") {
       return NextResponse.json({ error: "Промокод не применим к кэмпам" }, { status: 400 });
    }

    if (promo.specificItemId && promo.specificItemId !== campId) {
       return NextResponse.json({ error: "Промокод не применим к этому кэмпу" }, { status: 400 });
    }

    return NextResponse.json({
      id: promo.id,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
