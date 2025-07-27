import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3} from "@/app/_lib/s3";

export default async function uploadSheetMusicToS3(userId: string, fileName: string, sheetMusic: File): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${userId}/${fileName}`,
        ContentType: "application/pdf"
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/pdf',
        },
        body: sheetMusic,
    });

    if (!uploadResponse.ok) {
        throw new Error(`Failed to upload sheet music to S3 due to ${await uploadResponse.text()}`);
    }
    return fileName;
}