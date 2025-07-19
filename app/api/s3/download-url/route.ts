import {StatusCodes} from "http-status-codes";
import {NextResponse} from "next/server";
import { getServerSession } from "next-auth/next";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3, S3UrlResponse} from "@/app/_lib/s3";

export async function GET(request: Request): Promise<NextResponse<S3UrlResponse>> {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const session = await getServerSession();

    if (!fileName) {
        return NextResponse.json({ url: "", error: 'Missing fileName' }, { status: StatusCodes.BAD_REQUEST});
    }

    if (!session || !session.user) {
        return NextResponse.json({ url: "", error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
    }
    const userId = session.user.id;

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `users/${userId}/${fileName}`,
    })
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    return NextResponse.json({ url: signedUrl });




}