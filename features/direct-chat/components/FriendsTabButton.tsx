'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Users } from 'lucide-react';

import { ROUTES } from '@/features/shared/constants/route.constants';

export default function FriendsTabButton() {
    const pathname = usePathname();
    const isActive =
        pathname === ROUTES.DASHBOARD.ME.FRIENDS.BASE || pathname === ROUTES.DASHBOARD.ME.BASE;

    return (
        <Link
            href={ROUTES.DASHBOARD.ME.FRIENDS.BASE}
            className={`group flex items-center gap-4 rounded-[6px] px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#949ba4] hover:bg-[#35363c]/50 hover:text-[#dbdee1]'
            }`}
        >
            <Users
                className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-[#80848e] group-hover:text-[#dbdee1]'
                }`}
            />
            <span className="font-semibold">Друзья</span>
        </Link>
    );
}
