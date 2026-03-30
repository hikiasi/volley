import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// GET a single camp
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const camp = await prisma.camp.findUnique({
            where: { id: params.id }
        });
        if (!camp) {
            return NextResponse.json({ error: "Camp not found" }, { status: 404 });
        }
        return NextResponse.json(camp);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch camp" }, { status: 500 });
    }
}


// PATCH (update) a camp
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        
        // Build the data object for Prisma dynamically
        const dataToUpdate: any = {};

        // String fields
        const stringFields = ['title', 'slug', 'city', 'description', 'level', 'status', 'hotMessage', 'venueName', 'address', 'coverImageUrl'];
        stringFields.forEach(field => {
            if (body[field] !== undefined) dataToUpdate[field] = body[field];
        });

        // Numeric fields
        const numericFields = ['basePrice', 'earlyBirdPrice', 'depositAmount', 'maxParticipants', 'currentParticipants'];
        numericFields.forEach(field => {
            if (body[field] !== undefined && body[field] !== null) {
                const numValue = parseInt(body[field], 10);
                if (!isNaN(numValue)) {
                    dataToUpdate[field] = numValue;
                }
            }
        });
        
        // Date fields
        const dateFields = ['startDate', 'endDate', 'earlyBirdCutoff'];
        dateFields.forEach(field => {
            if (body[field]) {
                dataToUpdate[field] = new Date(body[field]);
            } else if (body[field] === null) {
                dataToUpdate[field] = null;
            }
        });

        // JSON fields
        if (body.customSections) {
            dataToUpdate.customSections = body.customSections;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }
        
        const updatedCamp = await prisma.camp.update({
            where: { id: params.id },
            data: dataToUpdate,
        });

        return NextResponse.json(updatedCamp);

    } catch (error) {
        console.error("Failed to update camp:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: "Failed to update camp", details: errorMessage }, { status: 500 });
    }
}
