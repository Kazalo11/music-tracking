export type Song = {
    spotifyId: string;
    title: string;
    artistNames: string[];
}
export type SongWithTutorial = Song & {
    sheetMusic: File | null;
    sheetMusicFileName?: string;
    tutorialUrl?: string;
}