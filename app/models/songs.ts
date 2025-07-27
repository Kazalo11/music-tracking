import * as z from 'zod';
import {zfd} from "zod-form-data";

const SongSchema = z.object({
    spotifyId: z.string(),
    title: z.string(),
    artistNames: z.array(z.string()),
});

export const SongWithTutorialSchema = SongSchema.extend({
    sheetMusic: z.instanceof(File).optional(),
    sheetMusicFileName: z.string().optional(),
    tutorialUrl: z.string().optional(),
});

export type Song = z.infer<typeof SongSchema>;
export type SongWithTutorial = z.infer<typeof SongWithTutorialSchema>;


export const submitSongFormDataSchema = zfd.formData(SongWithTutorialSchema);
export type SubmitSongFormData = z.infer<typeof submitSongFormDataSchema>;