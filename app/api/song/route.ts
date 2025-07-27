import {StatusCodes} from "http-status-codes";
import {SongWithTutorial} from "@/app/models/songs";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {isValidRequestBody} from "@/app/api/song/isValidBody";
import {dynamoDB} from "@/app/_lib/dynamodb";

export async function POST(request: Request) {
    const body: SongWithTutorial = await request.json();
    const { spotifyId, title, artistNames, tutorialUrl, sheetMusic } = body;

    if (!isValidRequestBody(body)) {
        return new Response("Invalid input", { status: StatusCodes.BAD_REQUEST });
    }

    if (sheetMusic) {
        const fileName = `${title}_${spotifyId}.pdf`
        const res = await fetch(`${process.env.BACKEND_URL}/api/s3/upload-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName,
                fileType: 'application/pdf',
            }),
        })
        const { url } = await res.json();
        if (!url) {
            return new Response("Failed to get upload URL", { status: StatusCodes.INTERNAL_SERVER_ERROR });
        }
        const uploadRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/pdf',
            },
            body: sheetMusic,
        });
        if (!uploadRes.ok) {
            return new Response("Failed to upload sheet music", { status: StatusCodes.INTERNAL_SERVER_ERROR });
        }
        body.sheetMusicFileName = fileName;
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
        console.error("Error saving song to DynamoDB:", error);
        return new Response("Failed to save song", { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }


    return new Response(JSON.stringify({id: spotifyId}), {
        status: StatusCodes.CREATED,
        headers: { "Content-Type": "application/json" },
    });
}