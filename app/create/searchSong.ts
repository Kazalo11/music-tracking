import {SongOption} from "@/app/create/form";
import {Song} from "@/app/models/songs";

export async function getSongOptionByName(name: string): Promise<SongOption[]> {
    const res = await fetch('/api/search/song?name=' + encodeURIComponent(name));
    const songs: Song[] = await res.json();
    return songs.map((song) => {
        return {
            ...song,
            value: song.spotifyId,
            label: `${song.title} by ${song.artistNames.join(', ')}`,
        }
    })
}