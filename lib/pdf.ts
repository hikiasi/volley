import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "ru-central1", // common for Timeweb
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export async function uploadToS3(key: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
}

export async function generateAndUploadReceipt(bookingId: string) {
  // Placeholder for @react-pdf/renderer logic as it requires complex setup
  // For MVP, we will simulate the PDF generation
  const mockPdf = Buffer.from(`Receipt for booking ${bookingId}`);
  const key = `receipts/${bookingId}.pdf`;
  return await uploadToS3(key, mockPdf, "application/pdf");
}
