'use client';

import { ConversationType } from '@backend/types/__generated__/enums';
import { Phone } from 'lucide-react';

import { GroupActions } from '@/features/direct-chat/components';

interface DirectChatHeaderProps {
    channelName: string;
    channelType: ConversationType;
    conversationId: string;
    isOwner: boolean;
    inCallMode?: boolean;
    onStartCall?: () => void;
}

export default function DirectChatHeader({
    channelName,
    channelType,
    conversationId,
    isOwner,
    inCallMode,
    onStartCall,
}: DirectChatHeaderProps) {
    if (inCallMode) return null;

    return (
        <div className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none">
            <span className="font-bold text-[#f2f3f5]">{channelName}</span>
            <div className="flex items-center gap-2">
                {onStartCall && (
                    <button
                        onClick={onStartCall}
                        className="cursor-pointer rounded p-1.5 text-[#b5bac1] transition-all hover:bg-[#35363c]/60 hover:text-[#dbdee1]"
                        title="Начать голосовой звонок"
                    >
                        <Phone size={18} />
                    </button>
                )}
                <GroupActions
                    conversationName={channelName}
                    channelType={channelType}
                    conversationId={conversationId}
                    isOwner={isOwner}
                />
            </div>
        </div>
    );
}
