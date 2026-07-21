'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Server, User } from '@backend/types/__generated__/client';
import { Hash, Menu, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { ROUTES } from '@/constants/route.constants';
import { ServerInfoResponse } from '@/features/auth/types/auth.types';
import { UserConversationsType } from '@/features/chat/types/chat.types';
import ServerCreationModal from '@/features/server/components/ServerCreationModal';
import ServerJoinModal from '@/features/server/components/ServerJoinModal';
import SidebarServer from '@/features/server/components/SidebarServer';
import VoiceStatusWidget from '@/features/voice/components/VoiceStatusWidget';

import MobileSidebarChannelList from './MobileSidebarServerList';
import SidebarUser from './SidebarUser';

interface MobileSidebarProps {
    userServers: Server[];
    serverInfo?: ServerInfoResponse | null;
    user: User;
    conversations?: UserConversationsType | null;
}

export default function MobileSidebar({
    userServers,
    serverInfo,
    user,
    conversations,
}: MobileSidebarProps) {
    const [open, setOpen] = useState(false);

    const userInitials = (name: string) => name.slice(0, 2).toUpperCase();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#dbdee1] hover:bg-[#35363c]/60 md:hidden">
                        <Menu size={24} />
                    </button>
                }
            />

            <SheetContent side="left" className="w-78! max-w-78! border-none bg-[#2b2d31] p-0!">
                <div className="flex h-full w-full overflow-hidden">
                    <div className="flex h-full w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3">
                        <Link
                            href={ROUTES.DASHBOARD.BASE}
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

                    <div className="flex h-full flex-1 flex-col justify-between overflow-hidden bg-[#2b2d31]">
                        {serverInfo ? (
                            <div className="discord-scroll flex flex-1 flex-col overflow-y-auto">
                                <div className="flex h-12 items-center border-b border-[#1f2023] px-4 font-bold text-white shadow-sm">
                                    <span className="truncate">{serverInfo.name}</span>
                                </div>
                                <MobileSidebarChannelList serverInfo={serverInfo} />
                            </div>
                        ) : conversations && conversations.length > 0 ? (
                            <div className="discord-scroll flex flex-1 flex-col overflow-y-auto">
                                <div className="flex h-12 items-center border-b border-[#1f2023] px-4 font-bold text-white shadow-sm">
                                    <span>Личные сообщения</span>
                                </div>
                                <ul className="mt-4 space-y-0.5 px-2">
                                    {conversations.map((conv) => {
                                        const otherParticipant = conv.participants.find(
                                            (p) => p.user.id !== user.id,
                                        )?.user;
                                        const chatName =
                                            conv.type === 'DIRECT'
                                                ? (otherParticipant?.displayName ??
                                                  otherParticipant?.email)
                                                : conv.name;

                                        return (
                                            <li key={conv.id}>
                                                <Link
                                                    href={`/dashboard/me/${conv.id}`}
                                                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-[#949ba4] hover:bg-[#35363c]/60 hover:text-[#dbdee1]"
                                                >
                                                    {conv.type === 'DIRECT' ? (
                                                        <Hash className="h-5 w-5 text-[#80848e]" />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-[#80848e]" />
                                                    )}
                                                    <span className="truncate">{chatName}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-xs text-[#949ba4]">
                                Нет активных бесед
                            </div>
                        )}

                        <div>
                            <div id="voice-status-sidebar-target"></div>
                            <SidebarUser user={user} />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
