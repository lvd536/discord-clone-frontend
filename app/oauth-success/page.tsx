'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { useAuthCookie } from '@/features/auth/hooks/useAuthCookie';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function OAuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const refetchUser = useAuthStore((s) => s.refetchUser);
    const { setAuthToken } = useAuthCookie();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            setAuthToken(token);

            refetchUser()
                .then(() => {
                    toast.success('Вход выполнен успешно!');
                    router.push('/profile');
                })
                .catch((err) => {
                    console.error('Не удалось загрузить профиль:', err);
                    router.push('/auth/login?error=profile_fetch_failed');
                });
        } else {
            router.push('/auth/login?error=no_token');
        }
    }, [refetchUser, searchParams, router, setAuthToken]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Авторизация... Пожалуйста, подождите.</p>
        </div>
    );
}
