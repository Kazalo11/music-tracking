import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3, S3UrlResponse} from "@/app/_lib/s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {NextRequest, NextResponse} from "next/server";
import {StatusCodes} from "http-status-codes";
import {auth} from "@/app/_lib/auth";



export async function POST(request: NextRequest): Promise<NextResponse<S3UrlResponse>> {
const {fileName, fileType} = await request.json();
    const session = await auth();
    console.info(session);
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