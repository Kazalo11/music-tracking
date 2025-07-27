import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/_lib/auth";
import {StatusCodes} from "http-status-codes";
import {GetCommand} from "@aws-sdk/lib-dynamodb";
import {dynamoDB} from "@/app/_lib/dynamodb";
import {SongWithTutorialSchema} from "@/app/models/songs";

type GetSongParams = {
    params: {
        spotifyId: string;
    }
}

export async function GET(request: NextRequest, {params}: GetSongParams): Promise<NextResponse> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }
    const {spotifyId} = params;
    const command = new GetCommand({
        TableName: process.env.DYNAMO_DB_TABLE_NAME!,
        Key: {
            userId,
            spotifyId
        }
    })

    const response = await dynamoDB.send(command);

    if (!response.Item) {
        return NextResponse.json("Song not found", { status: StatusCodes.NOT_FOUND });
    }
    let song;
    try {
        song = SongWithTutorialSchema.parse(response.Item);

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error parsing song data:", error.message);
            return NextResponse.json(`Failed to parse song data due to ${error.message}`, { status: StatusCodes.UNPROCESSABLE_ENTITY });
        }
    }
    return NextResponse.json(song, {
        status: StatusCodes.OK,
        headers: { "Content-Type": "application/json" },
    });


}