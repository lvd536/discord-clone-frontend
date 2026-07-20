'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { useAuthCookie } from '../hooks/useAuthCookie';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const refetchUser = useAuthStore((state) => state.refetchUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const { removeAuthToken } = useAuthCookie();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('access_token='))
                ?.split('=')[1];

            if (token) {
                try {
                    await refetchUser();
                } catch (error) {
                    console.error('Ошибка восстановления сессии:', error);
                    removeAuthToken();
                    clearUser();
                }
            } else {
                clearUser();
            }

            setIsInitializing(false);
        };

        initializeAuth();
    }, [refetchUser, clearUser, removeAuthToken]);

    useEffect(() => {
        let lastToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1];

        const interval = setInterval(async () => {
            const currentToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('access_token='))
                ?.split('=')[1];

            if (currentToken !== lastToken) {
                const wasLoggedIn = !!lastToken;
                const isLoggedIn = !!currentToken;

                lastToken = currentToken;

                if (!isLoggedIn) {
                    clearUser();
                } else if (isLoggedIn && !wasLoggedIn) {
                    try {
                        await refetchUser();
                    } catch (error) {
                        console.error('Ошибка восстановления сессии при синхронизации:', error);
                        removeAuthToken();
                        clearUser();
                    }
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [refetchUser, clearUser, removeAuthToken]);

    if (isInitializing) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground animate-pulse text-sm">
                    Восстановление сессии...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
