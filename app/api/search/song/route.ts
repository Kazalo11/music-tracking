import {NextRequest, NextResponse} from "next/server";
import {StatusCodes} from "http-status-codes";
import {Song} from "@/app/models/songs";
import {SearchResults} from "@spotify/web-api-ts-sdk";
import {sdk} from "@/app/_lib/spotify/sdk";

export type GetSongsResponse =
    {
        songs: Song[];
    }

export async function GET(request: NextRequest): Promise<NextResponse<GetSongsResponse>> {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    if (!name) {
        return NextResponse.json({songs: []}, {status: StatusCodes.BAD_REQUEST});
    }
    const res: SearchResults<["track"]> = await sdk.search(name, ["track"]);
    if (!res.tracks || res.tracks.items.length === 0) {
        return NextResponse.json({songs: []}, {status: StatusCodes.OK});
    }
    const songs: Song[] = res.tracks.items.map((item) => {
        return {
            spotifyId: item.id,
            artistNames: item.artists.map(artist => artist.name),
            title: item.name
        }
    });
    return NextResponse.json({songs}, {status: StatusCodes.OK});

}