'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Users2, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/features/shared/constants/route.constants';
import { usePresenceStore } from '@/features/shared/store/presence.store';

import { UserConversationType } from '../types/direct-chat.types';

interface IProps {
    conversation: UserConversationType;
    userId: string;
}

export default function DirectChat({ conversation, userId }: IProps) {
    const router = useRouter();
    const pathname = usePathname();
    const onlineUsers = usePresenceStore((state) => state.onlineUsers);

    const isDirect = conversation.type === 'DIRECT';
    const chatUrl = ROUTES.DASHBOARD.ME.ID(conversation.id);
    const isActive = pathname === chatUrl;

    const otherParticipant = conversation.participants?.find((p) => p.user.id !== userId)?.user;

    const chatName = isDirect
        ? (otherParticipant?.displayName ??
          otherParticipant?.email?.split('@')[0] ??
          'Пользователь')
        : conversation.name || 'Групповой чат';

    const lastMessage = conversation.messages?.[0]?.content;
    const participantCount = conversation.participants?.length ?? 0;

    const previewText = lastMessage
        ? lastMessage
        : isDirect
          ? 'В сети'
          : `${participantCount} участников`;

    const isOnline = Boolean(otherParticipant && onlineUsers.has(otherParticipant.id));

    const initials = (chatName || 'DM').slice(0, 2).toUpperCase();

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isActive) {
            router.push(ROUTES.DASHBOARD.ME.BASE);
        }
    };

    return (
        <li className="group relative my-0.5 list-none">
            <Link
                href={chatUrl}
                className={`flex items-center gap-3 rounded-[6px] px-2 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                        ? 'bg-[#35373c] text-[#f2f3f5]'
                        : 'text-[#949ba4] hover:bg-[#35363c]/50 hover:text-[#dbdee1]'
                }`}
            >
                <div className="relative shrink-0">
                    {isDirect ? (
                        <div className="relative">
                            <Avatar className="h-9 w-9 ring-1 ring-white/5">
                                <AvatarImage
                                    src={otherParticipant?.avatarUrl || ''}
                                    alt={chatName}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-[#5865f2] text-xs font-bold text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="absolute -right-0.5 -bottom-0.5 flex items-center justify-center">
                                <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2b2d31] p-0.5">
                                    <span
                                        className={`h-full w-full rounded-full ${
                                            isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
                                        }`}
                                    />
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {conversation.imageUrl ? (
                                <Avatar className="h-9 w-9 rounded-xl">
                                    <AvatarImage
                                        src={conversation.imageUrl}
                                        alt={chatName}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-[#5865f2] text-xs font-bold text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150 ${
                                        isActive
                                            ? 'border-[#5865f2] bg-[#5865f2] text-white'
                                            : 'border-[#5865f2]/25 bg-[#5865f2]/10 text-[#5865f2] group-hover:bg-[#5865f2] group-hover:text-white'
                                    }`}
                                >
                                    <Users2 className="h-4.5 w-4.5" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center justify-between gap-1">
                        <span
                            className={`truncate text-sm leading-tight font-semibold transition-colors ${
                                isActive ? 'text-white' : 'text-[#dbdee1] group-hover:text-white'
                            }`}
                        >
                            {chatName}
                        </span>
                    </div>

                    <span
                        className={`mt-0.5 truncate text-xs leading-tight font-normal transition-colors ${
                            isActive
                                ? 'text-[#b5bac1]'
                                : 'text-[#949ba4] group-hover:text-[#b5bac1]'
                        }`}
                    >
                        {previewText}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    className="ml-auto flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#949ba4] opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-[#111214]/60 hover:text-white"
                    title="Закрыть"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </Link>
        </li>
    );
}
