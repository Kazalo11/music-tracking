'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Provider } from "@/components/ui/provider"

type Props = {
    children: ReactNode;
};

export function Providers({ children }: Props) {
    return (
        <SessionProvider>
            <Provider>
                {children}
            </Provider>
        </SessionProvider>
    );
}