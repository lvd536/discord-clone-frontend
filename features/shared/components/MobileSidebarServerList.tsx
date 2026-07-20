import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Hash, Voicemail } from 'lucide-react';

import { ROUTES } from '@/constants/route.constants';
import { ServerInfoResponse } from '@/features/auth/types/auth.types';

interface IProps {
    serverInfo: ServerInfoResponse;
}

export default function MobileSidebarChannelList({ serverInfo }: IProps) {
    const pathname = usePathname();
    return (
        <ul className="space-y-0.5">
            {serverInfo.channels?.map((cn) => (
                <li key={cn.id}>
                    <Link
                        href={ROUTES.DASHBOARD.SERVER.CHANNEL(serverInfo.id, cn.id)}
                        className={`flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                            pathname.includes(cn.id)
                                ? 'bg-[#35363c] text-white'
                                : 'text-[#949ba4] hover:bg-[#35363c]/60 hover:text-[#dbdee1]'
                        }`}
                    >
                        {cn.type === 'TEXT' ? (
                            <Hash className="h-5 w-5 text-[#80848e]" />
                        ) : (
                            <Voicemail className="h-5 w-5 text-[#80848e]" />
                        )}
                        <span className="truncate">{cn.name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
