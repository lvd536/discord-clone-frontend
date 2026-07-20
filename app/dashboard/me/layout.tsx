import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Settings, User, UserPlus2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/constants/route.constants';
import { getProfile } from '@/features/auth/actions';
import { getUserConversations } from '@/features/chat/actions';
import CreateGroupModal from '@/features/chat/components/CreateGroupModal';
import { getUserServers } from '@/features/server/actions';
import MobileSidebar from '@/features/shared/components/MobileSidebar';

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

                <div className="flex h-13 w-full items-center justify-between bg-[#232428] px-2 py-1.5">
                    <div className="flex max-w-30 cursor-pointer items-center gap-2 rounded p-1">
                        {user.avatarUrl && (
                            <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                                        {(user.displayName ?? user.email).slice(0, 2)}
                                    </div>
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-bold text-[#f2f3f5]">
                                {user.displayName ?? user.email.slice(0, 5)}
                            </span>
                        </div>
                    </div>
                    <Link
                        href={ROUTES.PROFILE}
                        className="group rounded p-1 transition-colors hover:bg-[#35373c]"
                    >
                        <Settings className="h-5 w-5 text-[#b5bac1] transition-colors group-hover:text-[#f2f3f5]" />
                    </Link>
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
