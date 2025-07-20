import {checkIfEnvVariablesExist} from "@/app/_lib/spotify/envVariablesCheck";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {scopes} from "@/app/_lib/spotify/scopes";

checkIfEnvVariablesExist();

export const sdk = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!,
    scopes
)
