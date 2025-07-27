"use client"
import {Button, Card, Field, Input, Stack} from "@chakra-ui/react"
import {useState} from "react";
import {Song} from "@/app/models/songs";
import UploadFile from "@/app/create/uploadFile";
import Dropdown, {OptionType} from "@/components/dropdown";
import {getSongOptionByName} from "@/app/create/searchSong";

export type SongOption = Song & OptionType;


export default function FormPage() {
    const [sheetMusic, setSheetMusic] = useState<File | null>(null);
    const [songOption, setSongOption] = useState<SongOption | null>(null);
    const [tutorialUrl, setTutorialUrl] = useState<string>("");

    const handleSubmit = async () => {
        if (!songOption) {
            alert("Please select a song first");
            return;
        }

        if (!tutorialUrl) {
            alert("Please enter a YouTube tutorial link");
            return;
        }

        if (!sheetMusic && !confirm("Are you sure you want to submit without a sheet music file?")) return;

        const {value, label, ...song} = songOption;

        const formData = new FormData();
        formData.append("spotifyId", song.spotifyId);
        formData.append("title", song.title);
        formData.append("artistNames", JSON.stringify(song.artistNames));
        formData.append("tutorialUrl", tutorialUrl);
        if (sheetMusic) {
            formData.append("sheetMusic", sheetMusic);
        }

        const res = await fetch("/api/song", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const error = await res.text();
            alert(`Failed to submit song: ${error}`);
            return;
        }

        alert("Song submitted successfully!");
    };


    return (
        <Card.Root>
            <Card.Header>
                <Card.Title>Add in a new song</Card.Title>
                <Card.Description>
                    Fill in this form with the song information
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Stack gap="4" w="full">
                    <Field.Root>
                        <Field.Label>Enter in a song</Field.Label>
                        <Field.HelperText>Search for a song using Spotify</Field.HelperText>
                        <Dropdown
                            loadOptions={getSongOptionByName}
                            setValue={setSongOption}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Youtube Tutorial Link</Field.Label>
                        <Input
                            placeholder="Enter in the YouTube link for the tutorial"
                            onChange={(e) => setTutorialUrl(e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Upload Sheet Music</Field.Label>
                        <Field.HelperText>Upload a sheet music file</Field.HelperText>
                        <UploadFile setSheetMusic={setSheetMusic} />
                    </Field.Root>
                </Stack>

            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Button variant="solid" colorScheme="teal" onClick={() => handleSubmit()}>Submit</Button>

            </Card.Footer>

        </Card.Root>
    )
}