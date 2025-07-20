import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export type UploadFileProps = {
    setSheetMusic: (sheetMusic: File) => void
}

export default function UploadFile({setSheetMusic}: UploadFileProps) {
    return (
        <FileUpload.Root accept="application/pdf"
        onFileAccept={(file) => {
            setSheetMusic(file.files[0]);
        }}>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                    <HiUpload /> Upload file
                </Button>
            </FileUpload.Trigger>
            <FileUpload.List />
        </FileUpload.Root>
    )
}