"use client"
import {Heading, VStack} from "@chakra-ui/react";
import FormPage from "@/app/create/form";

export default function CreatePage() {
    return (
        <VStack>
            <Heading>Fill in this form with the song information</Heading>
            <FormPage/>
        </VStack>
    )
}