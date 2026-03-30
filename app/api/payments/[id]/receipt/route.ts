import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateReceiptPdf } from "@/lib/pdf";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentId = params.id;

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
        userId: user.sub as string, // Ensure user can only download their own receipts
      },
      include: {
        booking: {
          include: {
            camp: true,
          },
        },
      },
    });

    if (!payment || !payment.booking) {
      return NextResponse.json({ error: "Payment or associated booking not found." }, { status: 404 });
    }
    
    if (payment.status !== 'succeeded') {
        return NextResponse.json({ error: "Receipt is only available for successful payments." }, { status: 400 });
    }

    const pdfBuffer = await generateReceiptPdf(payment.booking);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="receipt-${payment.booking.id}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Receipt Generation Error:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to generate receipt: ${error.message}` }, { status: 500 });
  }
}
