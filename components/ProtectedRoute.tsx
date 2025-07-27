'use client';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

type Props = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
    const {status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('spotify');
        }
    }, [status]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}