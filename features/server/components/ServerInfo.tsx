import { ServerInfoResponse } from '@/features/auth/types/auth.types';
import CreateChannelModal from '@/features/shared/components/CreateChannelModal';
import MobileSidebarChannelList from '@/features/shared/components/MobileSidebarServerList';

interface IProps {
    serverInfo: ServerInfoResponse;
}

export default function ServerInfo({ serverInfo }: IProps) {
    return (
        <div className="discord-scroll flex flex-1 flex-col overflow-y-auto">
            <div className="flex h-12 items-center border-b border-[#1f2023] px-4 font-bold text-white shadow-sm">
                <span className="truncate">{serverInfo.name}</span>
            </div>

            <div className="mt-4 px-2">
                <div className="mb-1 flex items-center justify-between px-1.5 text-xs font-bold text-[#949ba4] uppercase">
                    <span>Каналы</span>
                    <CreateChannelModal serverId={serverInfo.id} />
                </div>

                <MobileSidebarChannelList serverInfo={serverInfo} />
            </div>
        </div>
    );
}
