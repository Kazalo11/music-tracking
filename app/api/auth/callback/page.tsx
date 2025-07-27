'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 1000); // 1-second delay

        return () => clearTimeout(timer);
    }, [router]);


    return (
        <div>
            <h1>Callback Page</h1>
            <p>You should be redirected automatically.</p>
        </div>
    );
}
