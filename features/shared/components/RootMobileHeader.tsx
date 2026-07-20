'use client';

import { usePathname } from 'next/navigation';

import { Server, User } from '@backend/types/__generated__/client';

import MobileSidebar from './MobileSidebar';

interface RootMobileHeaderProps {
    userServers: Server[];
    user: User;
}

export default function RootMobileHeader({ userServers, user }: RootMobileHeaderProps) {
    const pathname = usePathname();

    if (pathname !== '/dashboard') return null;

    return (
        <div className="z-30 flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none md:hidden">
            <div className="flex items-center gap-2">
                <MobileSidebar userServers={userServers} user={user} />
                <span className="text-sm font-bold text-white">Главная</span>
            </div>
        </div>
    );
}
