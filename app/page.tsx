import { Flex, Heading } from "@chakra-ui/react";

export default function HomePage() {
    return (
        <Flex justify="center" py={8}>
            <Heading size="2xl">Welcome to the Music Learning App!</Heading>
            // TODO: Show the homepage with a list all songs they have uploaded so far, and be able to click on a song to view its details
        </Flex>
    );
}