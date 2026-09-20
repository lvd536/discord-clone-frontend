'use client';

import { useLayoutEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ProfileCredits, ProfileHeader, ProfileIntegrations } from '@/features/profile/components';
import { ROUTES } from '@/features/shared/constants/route.constants';

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
                <div className="relative items-center gap-2">
                    <Link
                        href={ROUTES.DASHBOARD.ME.BASE}
                        className="hover:bg-accent absolute top-1 -left-10 rounded-full p-2 transition-colors duration-300"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="pt-2 text-xl font-bold tracking-wide text-white">
                        Моя учетная запись
                    </h1>
                </div>

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
