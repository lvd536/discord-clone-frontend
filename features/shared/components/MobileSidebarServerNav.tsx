'use client';

import Link from 'next/link';

import { Server } from '@backend/types/__generated__/client';

import { ServerCreationModal, ServerJoinModal, SidebarServer } from '@/features/server/components';
import { ROUTES } from '@/features/shared/constants/route.constants';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

interface MobileSidebarServerNavProps {
    userServers: Server[];
    serverInfo?: ServerInfoResponse | null;
}

export default function MobileSidebarServerNav({
    userServers,
    serverInfo,
}: MobileSidebarServerNavProps) {
    return (
        <div className="flex h-full w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3 select-none">
            <Link
                href={ROUTES.DASHBOARD.ME.BASE}
                className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] bg-[#313338] text-white transition-all duration-200 hover:rounded-[16px] hover:bg-[#5865f2]"
            >
                <span className="text-sm font-bold">DM</span>
            </Link>
            <div className="my-1 h-0.5 w-8 rounded bg-[#35363c]" />

            <div className="discord-scroll w-full flex-1 overflow-y-auto">
                <ul className="flex flex-col items-center space-y-2 pb-4">
                    {userServers.map((server) => (
                        <SidebarServer
                            server={server}
                            serverInfo={serverInfo || undefined}
                            key={server.id}
                        />
                    ))}
                </ul>
            </div>

            <div className="mt-auto flex flex-col gap-2">
                <ServerCreationModal />
                <ServerJoinModal />
            </div>
        </div>
    );
}
