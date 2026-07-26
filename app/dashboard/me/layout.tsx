import Link from 'next/link';
import { redirect } from 'next/navigation';

import { User, UserPlus2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { getProfile } from '@/features/auth/actions';
import { getUserConversations } from '@/features/direct-chat/actions';
import { CreateGroupModal } from '@/features/direct-chat/components';
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
                    <div className="flex h-12 cursor-pointer items-center justify-between gap-2 border-b border-[#1f2023] px-4 font-bold text-white shadow-sm hover:bg-[#35363c]/40">
                        <span className="text-sm">Личные сообщения</span>
                        <Link
                            href={ROUTES.DASHBOARD.ME.FRIENDS.BASE}
                            className="text-xs text-[#23a55a] hover:underline"
                        >
                            Друзья
                        </Link>
                        <CreateGroupModal />
                    </div>

                    <div className="mt-4 px-2">
                        {conversations && conversations.length > 0 ? (
                            <ul className="discord-scroll space-y-0.5">
                                {conversations.map((conversation) => {
                                    const otherParticipant = conversation.participants.find(
                                        (p) => p.user.id !== user.id,
                                    )?.user;

                                    const chatName =
                                        conversation.type === 'DIRECT'
                                            ? (otherParticipant?.displayName ??
                                              otherParticipant?.email)
                                            : conversation.name;

                                    return (
                                        <li key={conversation.id}>
                                            <Link
                                                href={ROUTES.DASHBOARD.ME.ID(conversation.id)}
                                                className="flex flex-col gap-0.5"
                                            >
                                                <div className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium text-[#949ba4] hover:bg-[#35363c]/60 hover:text-[#dbdee1]">
                                                    {conversation.type === 'DIRECT' ? (
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={otherParticipant?.avatarUrl}
                                                            />
                                                            <AvatarFallback>
                                                                <User className="h-5 w-5 text-[#80848e]" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={otherParticipant?.avatarUrl}
                                                            />
                                                            <AvatarFallback>
                                                                <UserPlus2Icon className="h-5 w-5 text-[#80848e]" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <span className="truncate">{chatName}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
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
