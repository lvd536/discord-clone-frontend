'use client';

import { useLayoutEffect } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import ProfileCredits from '@/features/profile/components/ProfileCredits';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileIntegrations from '@/features/profile/components/ProfileIntegrations';

export default function ProfilePage() {
    const { profile, refetchUser } = useAuthStore();

    useLayoutEffect(() => {
        if (!profile) refetchUser();
    }, [profile, refetchUser]);

    if (!profile) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#313338]">
                <div className="text-muted-foreground animate-pulse text-sm">
                    Загрузка профиля...
                </div>
            </div>
        );
    }
    return (
        <div className="discord-scroll w-full flex-1 overflow-y-auto bg-[#313338] px-6 py-10 select-none">
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-xl font-bold tracking-wide text-white">Моя учетная запись</h1>

                <div className="overflow-hidden rounded-lg border border-[#1f2023]/60 bg-[#1e1f22] pb-6 shadow-xl">
                    <div className="relative h-28 w-full bg-[#5865f2]" />

                    <ProfileHeader />

                    <ProfileCredits />
                </div>

                <ProfileIntegrations />
            </div>
        </div>
    );
}
