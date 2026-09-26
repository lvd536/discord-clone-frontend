'use client';

import { User } from '@backend/types/__generated__/client';
import { Search } from 'lucide-react';
import ConversationsList from '@/features/direct-chat/components/ConversationList';
import FriendsTabButton from '@/features/direct-chat/components/FriendsTabButton';
import { UserConversationsType } from '@/features/direct-chat/types/direct-chat.types';
import CreateGroupModal from "@/features/direct-chat/components/CreateGroupModal";

interface MobileSidebarDirectListProps {
    conversations: UserConversationsType;
    user: User;
}

export default function MobileSidebarDirectList({
    conversations,
    user,
}: MobileSidebarDirectListProps) {
    return (
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

                    <div className="mt-4 flex shrink-0 items-center justify-between px-2 pb-1 text-[11px] font-bold tracking-wider text-[#949ba4] uppercase select-none">
                        <span>Личные сообщения</span>
                        <CreateGroupModal />
                    </div>

                    <ConversationsList conversations={conversations} currentUserId={user.id} />
                </div>
            </div>
        </div>
    );
}
