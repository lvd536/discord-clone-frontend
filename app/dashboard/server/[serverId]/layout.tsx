import Link from 'next/link';

import { EllipsisVertical, Hash, Voicemail } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ROUTES } from '@/constants/route.constants';
import { getProfile } from '@/features/auth/actions';
import { getServerInfo, getUserServers } from '@/features/server/actions';
import ServerActions from '@/features/server/components/ServerActions';
import CreateChannelModal from '@/features/shared/components/CreateChannelModal';
import MobileSidebar from '@/features/shared/components/MobileSidebar';
import SidebarUser from '@/features/shared/components/SidebarUser';

interface IProps {
    params: Promise<{ serverId: string }>;
    children: React.ReactNode;
}

export default async function ServerLayout({ params, children }: IProps) {
    const { serverId } = await params;

    const [userResponse, serverResponse, userServersResponse] = await Promise.all([
        getProfile(),
        getServerInfo(serverId),
        getUserServers(),
    ]);

    const serverInfo = serverResponse.success ? serverResponse.data : null;
    const user = userResponse.success ? userResponse.data : null;
    const userServers = userServersResponse.success ? userServersResponse.data : [];

    if (!serverInfo || !user) return null;

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="z-10 hidden w-60 shrink-0 flex-col justify-between bg-[#2b2d31] md:flex">
                <div className="flex flex-col">
                    <div className="flex h-12 cursor-pointer items-center justify-between border-b border-[#1f2023] px-4 font-bold text-white shadow-sm hover:bg-[#35363c]/40">
                        <span>{serverInfo.name}</span>
                        <ServerActions serverName={serverInfo.name} serverId={serverInfo.id} />
                    </div>

                    <div className="mt-4 px-2">
                        <div className="mb-1 flex items-center justify-between px-1.5 text-xs font-bold text-[#949ba4] uppercase">
                            <span>Каналы</span>
                            <CreateChannelModal serverId={serverId} />
                        </div>

                        <ul className="discord-scroll">
                            {serverInfo.channels &&
                                serverInfo.channels.length > 0 &&
                                serverInfo.channels.map((cn) => (
                                    <li key={cn.id}>
                                        <Link
                                            href={ROUTES.DASHBOARD.SERVER.CHANNEL(
                                                serverInfo.id,
                                                cn.id,
                                            )}
                                            className="flex flex-col gap-0.5"
                                        >
                                            <div className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium text-[#949ba4] hover:bg-[#35363c]/60 hover:text-[#dbdee1]">
                                                {cn.type === 'TEXT' ? (
                                                    <Hash className="h-5 w-5 text-[#80848e]" />
                                                ) : (
                                                    <Voicemail className="h-5 w-5 text-[#80848e]" />
                                                )}
                                                <span>{cn.name}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <div id="voice-status-sidebar-target"></div>
                    <SidebarUser user={user} />
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="z-30 flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none md:hidden">
                    <div className="flex items-center gap-2">
                        <MobileSidebar
                            userServers={userServers}
                            serverInfo={serverInfo}
                            user={user}
                        />
                        <span className="max-w-40 truncate text-sm font-bold text-white">
                            {serverInfo.name}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
            </div>
        </div>
    );
}
