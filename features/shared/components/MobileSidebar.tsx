'use client';

import { useState } from 'react';

import { Server, User } from '@backend/types/__generated__/client';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { UserConversationsType } from '@/features/direct-chat/types/direct-chat.types';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

import MobileSidebarDirectList from './MobileSidebarDirectList';
import MobileSidebarChannelList from './MobileSidebarServerList';
import MobileSidebarServerNav from './MobileSidebarServerNav';
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
                    <MobileSidebarServerNav userServers={userServers} serverInfo={serverInfo} />

                    <div className="flex h-full flex-1 flex-col justify-between overflow-hidden bg-[#2b2d31]">
                        {serverInfo ? (
                            <div className="discord-scroll flex flex-1 flex-col overflow-y-auto">
                                <div className="flex h-12 items-center border-b border-[#1f2023] px-4 font-bold text-white shadow-sm">
                                    <span className="truncate">{serverInfo.name}</span>
                                </div>
                                <MobileSidebarChannelList serverInfo={serverInfo} />
                            </div>
                        ) : conversations && conversations.length > 0 ? (
                            <MobileSidebarDirectList conversations={conversations} user={user} />
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-xs text-[#949ba4]">
                                Нет активных бесед
                            </div>
                        )}

                        <div>
                            <div id="voice-status-sidebar-target" />
                            <SidebarUser user={user} />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
