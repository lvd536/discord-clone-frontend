'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const refetchUser = useAuthStore((state) => state.refetchUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (token) {
                try {
                    await refetchUser();
                } catch (error) {
                    console.error('Ошибка восстановления сессии:', error);
                    localStorage.removeItem('access_token');
                    clearUser();
                }
            }

            setIsInitializing(false);
        };

        initializeAuth();
    }, [refetchUser, clearUser]);

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
