import {SongOption} from "@/app/create/form";
import {Song} from "@/app/models/songs";
import debounce from 'debounce-promise';

async function fetchSongOptionByName(name: string): Promise<SongOption[]> {
    if (!name) return [];
    const res = await fetch('/api/search/song?name=' + encodeURIComponent(name));
    const { songs }: { songs: Song[] } = await res.json();
    return songs.map((song) => {
        return {
            ...song,
            value: song.spotifyId,
            label: `${song.title} by ${song.artistNames.join(', ')}`,
        }
    })
}

export const getSongOptionByName = debounce(fetchSongOptionByName, 300)
