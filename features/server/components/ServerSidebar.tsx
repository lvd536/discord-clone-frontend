import { User } from '@backend/types/__generated__/client';

import { ServerActions } from '@/features/server/components';
import { CreateChannelModal, SidebarUser } from '@/features/shared/components';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

import ServerChannelList from './ServerChannelList';

interface ServerSidebarProps {
    serverInfo: ServerInfoResponse;
    user: User;
}

export default function ServerSidebar({ serverInfo, user }: ServerSidebarProps) {
    return (
        <div className="z-10 hidden w-60 shrink-0 flex-col justify-between bg-[#2b2d31] select-none md:flex">
            <div className="flex flex-col">
                <div className="flex h-12 cursor-pointer items-center justify-between px-4 font-bold text-white shadow-sm hover:bg-[#35363c]/40">
                    <span className="truncate">{serverInfo.name}</span>
                    <ServerActions serverInfo={serverInfo} />
                </div>

                <div className="mt-4 px-2">
                    <div className="mb-1 flex items-center justify-between px-1.5 text-xs font-bold text-[#949ba4] uppercase">
                        <span>Каналы</span>
                        <CreateChannelModal serverId={serverInfo.id} />
                    </div>

                    <ServerChannelList serverId={serverInfo.id} channels={serverInfo.channels} />
                </div>
            </div>

            <div>
                <div id="voice-status-sidebar-target" />
                <SidebarUser user={user} />
            </div>
        </div>
    );
}
