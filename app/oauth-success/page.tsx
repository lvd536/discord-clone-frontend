'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth.store';

export default function OAuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const refetchUser = useAuthStore((state) => state.refetchUser);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            document.cookie = `access_token=${token}; path=/; max-age=900; SameSite=Lax`;

            refetchUser()
                .then(() => {
                    toast.success('Авторизация через OAuth успешна!');
                    router.push('/dashboard');
                })
                .catch(() => {
                    router.push('/auth/login?error=profile_fetch_failed');
                });
        } else {
            router.push('/auth/login?error=no_token');
        }
    }, [searchParams, router, refetchUser]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1e1f22] text-white">
            <p className="animate-pulse text-sm text-[#949ba4]">Синхронизация сессии...</p>
        </div>
    );
}
