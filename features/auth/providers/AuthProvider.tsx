'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { usePresence } from '@/features/shared/hooks/usePresence';
import { usePresenceStore } from '@/features/shared/store/presence.store';

import { useAuthCookie } from '../hooks/useAuthCookie';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const refetchUser = useAuthStore((state) => state.refetchUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const setOnlineUsers = usePresenceStore((state) => state.setOnlineUsers);
    const { removeAuthToken } = useAuthCookie();

    const [isInitializing, setIsInitializing] = useState(true);
    const [authToken, setAuthToken] = useState<string | null>(null);

    usePresence(authToken);

    useNotifications(authToken);

    useEffect(() => {
        const initializeAuth = async () => {
            console.info('Auth: initializeAuth call');
            await refetchUser();

            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('access_token='))
                ?.split('=')[1];

            if (token) {
                console.info('Auth: access token found');
                try {
                    setAuthToken(token);
                } catch (error) {
                    console.error('Ошибка восстановления сессии:', error);
                    removeAuthToken();
                    clearUser();
                    setAuthToken(null);
                    setOnlineUsers([]);
                }
            } else {
                clearUser();
                setAuthToken(null);
                setOnlineUsers([]);
            }

            setIsInitializing(false);
        };

        initializeAuth();
    }, [refetchUser, clearUser, removeAuthToken, setOnlineUsers]);

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
                    setAuthToken(null);
                    setOnlineUsers([]);
                } else if (isLoggedIn && !wasLoggedIn) {
                    try {
                        await refetchUser();
                        setAuthToken(currentToken);
                    } catch (error) {
                        console.error('Ошибка восстановления сессии при синхронизации:', error);
                        removeAuthToken();
                        clearUser();
                        setAuthToken(null);
                        setOnlineUsers([]);
                    }
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [refetchUser, clearUser, removeAuthToken, setOnlineUsers]);

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
