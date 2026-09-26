import { User } from '@backend/types/__generated__/client';
import { Search } from 'lucide-react';

import { CreateGroupModal } from '@/features/direct-chat/components';
import ConversationsList from '@/features/direct-chat/components/ConversationList';
import FriendsTabButton from '@/features/direct-chat/components/FriendsTabButton';
import { UserConversationsType } from '@/features/direct-chat/types/direct-chat.types';
import { SidebarUser } from '@/features/shared/components';

interface DirectSidebarProps {
    user: User;
    conversations: UserConversationsType | null;
}

export default function DirectSidebar({ user, conversations }: DirectSidebarProps) {
    return (
        <div className="z-10 hidden w-60 shrink-0 flex-col justify-between bg-[#2b2d31] select-none md:flex">
            <div className="flex flex-col">
                <div className="flex h-12 items-center border-b border-[#1f2023] px-3 shadow-xs">
                    <button
                        type="button"
                        className="flex h-7 w-full cursor-pointer items-center justify-between rounded bg-[#1e1f22] px-2 text-xs font-medium text-[#949ba4] transition-colors hover:text-[#dbdee1]"
                    >
                        <span>Найти или начать беседу</span>
                        <Search className="h-3.5 w-3.5 text-[#949ba4]" />
                    </button>
                </div>

                <div className="px-2 pt-3">
                    <FriendsTabButton />

                    <div className="mt-4 flex items-center justify-between px-2 pb-1 text-[11px] font-bold tracking-wider text-[#949ba4] uppercase">
                        <span>Личные сообщения</span>
                        <CreateGroupModal />
                    </div>

                    {conversations && conversations.length > 0 ? (
                        <ConversationsList conversations={conversations} currentUserId={user.id} />
                    ) : (
                        <div className="p-4 text-center text-xs text-[#949ba4] italic">
                            Начните общение прямо сейчас!
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div id="voice-status-sidebar-target" />
                <SidebarUser user={user} />
            </div>
        </div>
    );
}
