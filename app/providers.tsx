'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";

type Props = {
    children: ReactNode;
};

export function Providers({ children }: Props) {
    return (
        <SessionProvider>
            <AppRouterCacheProvider>
                {children}
            </AppRouterCacheProvider>
        </SessionProvider>
    );
}