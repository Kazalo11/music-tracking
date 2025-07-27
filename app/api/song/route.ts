import {StatusCodes} from "http-status-codes";
import {SongWithTutorial, submitSongFormDataSchema} from "@/app/models/songs";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {isValidRequestBody} from "@/app/api/song/isValidBody";
import {dynamoDB} from "@/app/_lib/dynamodb";
import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/_lib/auth";
import uploadSheetMusicToS3 from "@/app/api/song/uploadSheetMusicToS3";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }

    const {spotifyId, title, tutorialUrl, artistNames, sheetMusic} = submitSongFormDataSchema.parse(await request.formData());


    // const formData = await request.formData();
    // const spotifyId = formData.get("spotifyId") as string;
    // const title = formData.get("title") as string;
    // const tutorialUrl = formData.get("tutorialUrl") as string;
    // const artistNames = JSON.parse(formData.get("artistNames") as string) as string[];
    // const sheetMusic = formData.get("sheetMusic") as File | null;

    const body: SongWithTutorial = {
        spotifyId,
        title,
        tutorialUrl,
        artistNames,
        sheetMusic,
        sheetMusicFileName: undefined
    };

    if (!isValidRequestBody(body)) {
        return NextResponse.json("Invalid input", { status: StatusCodes.BAD_REQUEST });
    }

    if (sheetMusic) {
        const fileName = `${title}.pdf`
        try {
            body.sheetMusicFileName = await uploadSheetMusicToS3(session.user.id, fileName, sheetMusic);
        } catch (err) {
            if (err instanceof Error) {
                const message = err.message;
                console.error("Error uploading sheet music to S3:", message);
                return NextResponse.json(`Failed to upload sheet music due to ${message}`, { status: StatusCodes.INTERNAL_SERVER_ERROR });
            }
        }
    }

    const command = new PutCommand({
        TableName: process.env.DYNAMO_DB_TABLE_NAME!,
        Item: {
            spotifyId,
            artistNames,
            title,
            tutorialUrl,
            ...(body.sheetMusicFileName && { sheetMusicFileName: body.sheetMusicFileName }),
        }
    });
    try {
        await dynamoDB.send(command);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error saving song to DynamoDB:", error);
            return NextResponse.json(`Failed to save song due to ${error.message}`, {status: StatusCodes.INTERNAL_SERVER_ERROR});
        }
    }
    return NextResponse.json({id: spotifyId}, {
        status: StatusCodes.CREATED,
        headers: { "Content-Type": "application/json" },
    });
}