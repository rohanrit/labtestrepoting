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

    return <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition w-full text-left">Logout</button>;
}

export default Logout