'use client';

import { ConversationType } from '@backend/types/__generated__/enums';
import { Volume2 } from 'lucide-react';

import GroupActions from '@/features/chat/components/GroupActions';

import VoiceGrid from './VoiceGrid';

interface IProps {
    channelId: string;
    conversationId?: string;
    channelType?: ConversationType;
    isOwner?: boolean;
}

export default function VoiceChannelInterface({
    channelId,
    conversationId,
    channelType,
    isOwner,
}: IProps) {
    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <div className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none">
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-[#80848e]" />
                        <span className="font-bold text-[#f2f3f5]">{channelId}</span>
                    </div>
                    {channelType === 'GROUP' && (
                        <GroupActions
                            conversationId={conversationId ?? 'Групповой войс'}
                            conversationName={channelId}
                            channelType={channelType}
                            isOwner={isOwner ?? false}
                        />
                    )}
                </div>

                <div className="flex items-center gap-3"></div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#2b2d31] p-6">
                <VoiceGrid />
            </div>
        </div>
    );
}
