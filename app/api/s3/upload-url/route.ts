import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3, S3UrlResponse} from "@/app/_lib/s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {StatusCodes} from "http-status-codes";



export async function POST(request: Request): Promise<NextResponse<S3UrlResponse>> {
const {fileName, fileType} = await request.json();
    const session = await getServerSession();
    if (!session || !session.user) {
        return NextResponse.json({ url: "", error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
    }

    const userId = session.user.id;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${userId}/${fileName}`,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    return NextResponse.json({url: signedUrl});
}