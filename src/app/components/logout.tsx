'use client';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import React from 'react';

const Logout = () => {
    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    redirect('/auth/signin');
                },
            },
        });
    }

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout