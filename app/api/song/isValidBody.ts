import {Song} from "@/app/models/songs";

export function isValidRequestBody(body: any): body is Song {
    return typeof body === 'object' &&
        body !== null &&
        typeof body.spotifyId === 'string' &&
        body.spotifyId.trim() !== '' &&
        typeof body.title === 'string' &&
        body.title.trim() !== '' &&
        Array.isArray(body.artistNames) &&
        body.artistNames.every((artist: any) => typeof artist === 'string' && artist.trim() !== '');

}