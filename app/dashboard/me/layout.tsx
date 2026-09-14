import { redirect } from 'next/navigation';

import { Search } from 'lucide-react';

import { getProfile } from '@/features/auth/actions';
import { getUserConversations } from '@/features/direct-chat/actions';
import { CreateGroupModal } from '@/features/direct-chat/components';
import DirectChat from '@/features/direct-chat/components/DirectChat';
import FriendsTabButton from '@/features/direct-chat/components/FriendsTabButton';
import { getUserServers } from '@/features/server/actions';
import { MobileSidebar, SidebarUser } from '@/features/shared/components';
import { ROUTES } from '@/features/shared/constants/route.constants';

interface IProps {
    children: React.ReactNode;
}

export default async function DirectLayout({ children }: IProps) {
    const [userResponse, conversationsResponse, userServersResponse] = await Promise.all([
        getProfile(),
        getUserConversations(),
        getUserServers(),
    ]);

    const conversations = conversationsResponse.success ? conversationsResponse.data : null;
    const user = userResponse.success ? userResponse.data : null;
    const userServers = userServersResponse.success ? userServersResponse.data : null;

    if (!user || !userServers) return redirect(ROUTES.AUTH.LOGIN);

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="z-10 hidden w-60 shrink-0 flex-col justify-between bg-[#2b2d31] md:flex">
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
                            <ul className="discord-scroll mt-1 space-y-0.5">
                                {conversations.map((conversation) => (
                                    <DirectChat
                                        conversation={conversation}
                                        userId={user.id}
                                        key={conversation.id}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-xs text-[#949ba4] italic">
                                Начните общение прямо сейчас!
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div id="voice-status-sidebar-target"></div>
                    <SidebarUser user={user} />
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="z-30 flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none md:hidden">
                    <MobileSidebar
                        userServers={userServers}
                        user={user}
                        conversations={conversations}
                    />
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
            </div>
        </div>
    );
}
