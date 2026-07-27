'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { User, UserPlus2Icon, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/features/shared/constants/route.constants';

import { UserConversationType } from '../types/direct-chat.types';

interface IProps {
    conversation: UserConversationType;
    userId: string;
}

export default function DirectChat({ conversation, userId }: IProps) {
    const router = useRouter();

    const otherParticipant = conversation.participants.find((p) => p.user.id !== userId)?.user;

    const chatName =
        conversation.type === 'DIRECT'
            ? (otherParticipant?.displayName ?? otherParticipant?.email)
            : conversation.name;

    const isOnline = true;

    return (
        <li key={conversation.id} className="group relative list-none">
            <Link
                href={ROUTES.DASHBOARD.ME.ID(conversation.id)}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-[#949ba4] transition-colors duration-150 hover:bg-[#35363c]/60 hover:text-[#dbdee1]"
            >
                <div className="relative shrink-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={otherParticipant?.avatarUrl} alt={chatName} />
                        <AvatarFallback className="bg-[#2b2d31]">
                            {conversation.type === 'DIRECT' ? (
                                <User className="h-4 w-4 text-[#b5bac1]" />
                            ) : (
                                <UserPlus2Icon className="h-4 w-4 text-[#b5bac1]" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    {conversation.type === 'DIRECT' && (
                        <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111214]">
                            <div
                                className={`h-2 w-2 rounded-full ${
                                    isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
                                }`}
                            />
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] font-medium text-[#949ba4] transition-colors group-hover:text-[#dbdee1]">
                        {chatName}
                    </span>

                    <span className="truncate text-xs font-normal text-[#949ba4]/70 transition-colors group-hover:text-[#949ba4]">
                        {conversation.type === 'DIRECT'
                            ? isOnline
                                ? 'В сети'
                                : 'Не в сети'
                            : 'Групповой чат'}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(ROUTES.DASHBOARD.ME.BASE);
                    }}
                    className="ml-auto shrink-0 rounded p-0.5 text-[#949ba4] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#1e1f22] hover:text-[#dbdee1]"
                    title="Закрыть диалог"
                >
                    <X className="h-4 w-4" />
                </button>
            </Link>
        </li>
    );
}
