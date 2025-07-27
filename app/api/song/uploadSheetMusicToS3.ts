import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3} from "@/app/_lib/s3";

export default async function uploadSheetMusicToS3(userId: string, fileName: string, sheetMusic: File): Promise<string> {
    const arrayBuffer = await sheetMusic.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${userId}/${fileName}`,
        Body: buffer,
        ContentType: "application/pdf",
    });

    await s3.send(command);

    return fileName;
}