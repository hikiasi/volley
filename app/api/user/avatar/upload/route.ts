import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No avatar file provided." }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatars/${user.sub}-${Date.now()}.${fileExtension}`;
    
    // Upload to S3
    const fileUrl = await uploadToS3(fileName, buffer, file.type);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.sub },
      data: { photoUrl: fileUrl },
    });

    return NextResponse.json({ photoUrl: fileUrl });

  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload avatar." }, { status: 500 });
  }
}
