'use client';

import { ConversationType } from '@backend/types/__generated__/enums';
import { Radio, User, Users, Volume2 } from 'lucide-react';
import VoiceControlsBar from './VoiceControlsBar';
import VoiceGrid from './VoiceGrid';
import GroupActions from "@/features/direct-chat/components/GroupActions";

interface IProps {
    channelId: string;
    conversationId?: string;
    channelType?: ConversationType;
    isOwner?: boolean;
    onLeave?: () => void;
}

export default function VoiceChannelInterface({
    channelId,
    conversationId,
    channelType,
    isOwner,
    onLeave,
}: IProps) {
    const renderIcon = () => {
        if (channelType === 'GROUP') {
            return <Users className="h-5 w-5 text-[#80848e]" />;
        }
        if (channelType === 'DIRECT') {
            return <User className="h-5 w-5 text-[#80848e]" />;
        }
        return <Volume2 className="h-5 w-5 text-[#80848e]" />;
    };

    return (
        <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <div className="z-20 flex h-12 w-full shrink-0 items-center justify-between border-b border-black/20 bg-[#313338] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.2)] select-none">
                <div className="flex min-w-0 items-center gap-2.5">
                    {renderIcon()}
                    <span className="truncate text-sm font-bold text-[#f2f3f5]">{channelId}</span>

                    <div className="hidden items-center gap-1.5 rounded-full bg-[#23a55a]/10 px-2 py-0.5 text-[11px] font-semibold text-[#23a55a] sm:flex">
                        <Radio className="h-3 w-3 animate-pulse" />
                        <span>RTC Подключено</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {channelType === 'GROUP' && (
                        <GroupActions
                            conversationId={conversationId ?? 'Групповой войс'}
                            conversationName={channelId}
                            channelType={channelType}
                            isOwner={isOwner ?? false}
                        />
                    )}
                </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#2b2d31]">
                <VoiceGrid />

                <VoiceControlsBar onDisconnect={onLeave} />
            </div>
        </div>
    );
}
