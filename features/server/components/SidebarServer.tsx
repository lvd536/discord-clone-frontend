import Link from 'next/link';

import { Server } from '@backend/types/__generated__/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/constants/route.constants';
import { ServerInfoResponse } from '@/features/auth/types/auth.types';

interface IProps {
    server: Server;
    serverInfo?: ServerInfoResponse;
}

export default function SidebarServer({ server, serverInfo }: IProps) {
    const serverInitials = (name: string) => name.slice(0, 2).toUpperCase();

    return (
        <li className="group relative flex h-12 w-12 shrink-0 items-center justify-center">
            <Link
                href={ROUTES.DASHBOARD.SERVER.ID(server.id)}
                className={`relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] text-white transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-[#5865f2] ${
                    serverInfo?.id === server.id ? 'rounded-[16px] bg-[#5865f2]' : 'bg-[#313338]'
                }`}
            >
                <Avatar className="rounded-inherit h-full w-full">
                    <AvatarImage
                        src={server.imageUrl ?? ''}
                        alt={server.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-transparent text-sm font-bold text-white uppercase">
                        {serverInitials(server.name)}
                    </AvatarFallback>
                </Avatar>
            </Link>
        </li>
    );
}
