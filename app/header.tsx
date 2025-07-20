"use client";
import Link from "next/link";
import { Box, HStack, Heading, Spacer } from "@chakra-ui/react";

export default function Header() {
    const navItems = [
        { href: "/", label: "🎵 Home" },
        { href: "/create", label: "➕ Add a song" },
    ];

    return (
        <Box as="header" bg="teal.500" color="white" py={4} px={6} boxShadow="md">
            <HStack as="nav"  alignItems="center" maxW="container.lg" mx="auto">
                <Heading as="h1" size="lg">
                    <Link href="/">Music Learning 🎶</Link>
                </Heading>
                <Spacer />
                {navItems.map((item) => (
                    <Heading as="h2" size="md" key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                    </Heading>
                ))}
            </HStack>
        </Box>
    );
}
