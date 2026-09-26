'use client';

import { MessageSquare, UserPlus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserPopoverHeaderProps {
    displayName: string;
    avatarUrl?: string | null;
    bannerColor: string;
    isOnline: boolean;
    requestSent: boolean;
    isChatLoading: boolean;
    onAddFriend: () => void;
    onStartChat: () => void;
}

export default function UserPopoverHeader({
    displayName,
    avatarUrl,
    bannerColor,
    isOnline,
    requestSent,
    isChatLoading,
    onAddFriend,
    onStartChat,
}: UserPopoverHeaderProps) {
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <>
            <div
                className="relative h-16 w-full transition-colors duration-300"
                style={{ backgroundColor: bannerColor }}
            />

            <div className="relative bottom-8 flex h-8 items-end justify-between px-4">
                <div className="relative">
                    <Avatar className="h-20 w-20 rounded-full border-[6px] border-[#111214] bg-[#1e1f22] object-cover">
                        <AvatarImage src={avatarUrl ?? ''} className="object-cover" />
                        <AvatarFallback className="bg-[#5865f2] text-xl font-bold text-white uppercase">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div
                        className={`absolute right-0.5 bottom-1 h-5 w-5 rounded-full border-[3.5px] border-[#111214] ${
                            isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
                        }`}
                        title={isOnline ? 'В сети' : 'Не в сети'}
                    />
                </div>

                <div className="mb-1 flex items-center gap-1.5">
                    <button
                        onClick={onAddFriend}
                        disabled={requestSent}
                        className={`flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            requestSent
                                ? 'bg-[#23a55a]/20 text-[#23a55a]'
                                : 'bg-[#2b2d31] text-white hover:bg-[#35363c]'
                        }`}
                        title="Отправить запрос в друзья"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>{requestSent ? 'Отправлено' : '+ Друг'}</span>
                    </button>

                    <button
                        onClick={onStartChat}
                        disabled={isChatLoading}
                        className="flex cursor-pointer items-center gap-1 rounded-md bg-[#2b2d31] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#35363c] disabled:opacity-50"
                        title="Написать сообщение"
                    >
                        <MessageSquare className="h-3.5 w-3.5 text-[#b5bac1]" />
                        <span>Чат</span>
                    </button>
                </div>
            </div>
        </>
    );
}
