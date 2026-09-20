'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Server, User } from '@backend/types/__generated__/client';
import { Menu, Search } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { CreateGroupModal } from '@/features/direct-chat/components';
import ConversationsList from '@/features/direct-chat/components/ConversationList';
import FriendsTabButton from '@/features/direct-chat/components/FriendsTabButton';
import { UserConversationsType } from '@/features/direct-chat/types/direct-chat.types';
import { ServerCreationModal, ServerJoinModal, SidebarServer } from '@/features/server/components';
import { ROUTES } from '@/features/shared/constants/route.constants';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

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

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#dbdee1] hover:bg-[#35363c]/60 md:hidden">
                        <Menu size={24} />
                    </button>
                }
            />

            <SheetContent
                side="left"
                className="w-full! max-w-[320px]! border-none bg-[#2b2d31] p-0! sm:w-78! sm:max-w-78!"
            >
                <div className="flex h-full w-full overflow-hidden">
                    <div className="flex h-full w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3">
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

                    <div className="flex h-full flex-1 flex-col justify-between overflow-hidden bg-[#2b2d31]">
                        {serverInfo ? (
                            <div className="discord-scroll flex flex-1 flex-col overflow-y-auto">
                                <div className="flex h-12 items-center border-b border-[#1f2023] px-4 font-bold text-white shadow-sm">
                                    <span className="truncate">{serverInfo.name}</span>
                                </div>
                                <MobileSidebarChannelList serverInfo={serverInfo} />
                            </div>
                        ) : conversations && conversations.length > 0 ? (
                            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#2b2d31]">
                                <div className="flex min-h-0 flex-1 flex-col">
                                    <div className="mt-2 flex h-12 shrink-0 items-center border-b border-[#1f2023] pr-11 pl-3 shadow-xs">
                                        <button
                                            type="button"
                                            className="flex h-7 w-full cursor-pointer items-center justify-between rounded bg-[#1e1f22] px-2 text-xs font-medium text-[#949ba4] transition-colors hover:text-[#dbdee1]"
                                        >
                                            <span>Найти беседу</span>
                                            <Search className="h-3.5 w-3.5 text-[#949ba4]" />
                                        </button>
                                    </div>

                                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pt-3">
                                        <FriendsTabButton />

                                        <div className="mt-4 flex shrink-0 items-center justify-between px-2 pb-1 text-[11px] font-bold tracking-wider text-[#949ba4] uppercase">
                                            <span>Личные сообщения</span>
                                            <CreateGroupModal />
                                        </div>

                                        <ConversationsList
                                            conversations={conversations}
                                            currentUserId={user.id}
                                        />
                                    </div>
                                </div>
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
