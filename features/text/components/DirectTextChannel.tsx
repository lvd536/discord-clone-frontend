'use client';

import { ConversationType } from '@backend/types/__generated__/enums';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import { serverUrl } from '@/features/shared/constants/livekit.constants';
import { useVoiceStore } from '@/features/shared/store/voice.store';
import DirectChatArea from './DirectChatArea';
import VoiceChannelInterface from "@/features/voice/components/VoiceChannelInterface";

interface IProps {
    channelId: string;
    accessToken: string;
    channelName: string;
    channelType: ConversationType;
    currentUserId: string;
    currentUsername: string;
    isOwner: boolean;
}

export default function DirectTextChannel({
    channelId,
    accessToken,
    channelName,
    channelType,
    currentUserId,
    currentUsername,
    isOwner,
}: IProps) {
    const { activeChannelId, isConnected, connect } = useVoiceStore();

    const isCurrentChatInCall = isConnected && activeChannelId === channelId;

    const handleStartCall = () => {
        connect({
            channelId,
            channelName,
            token: accessToken,
        });
    };

    if (isCurrentChatInCall) {
        return (
            <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
                <div className="flex h-[45%] min-h-65 flex-col border-b border-[#1f2023] bg-[#2b2d31]">
                    <VoiceChannelInterface
                        conversationId={channelId}
                        channelId={channelName}
                        channelType={channelType}
                        isOwner={isOwner}
                    />
                </div>

                <div className="min-h-0 flex-1">
                    <DirectChatArea
                        conversationId={channelId}
                        channelName={channelName}
                        inCallMode={true}
                        channelType={channelType}
                        currentUserId={currentUserId}
                        currentUsername={currentUsername}
                        isOwner={isOwner}
                    />
                </div>
            </div>
        );
    }

    return (
        <LiveKitRoom
            key={channelId}
            video={false}
            audio={false}
            screen={false}
            token={accessToken}
            serverUrl={serverUrl}
            connect={true}
            className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white"
        >
            <DirectChatArea
                conversationId={channelId}
                channelName={channelName}
                onStartCall={handleStartCall}
                channelType={channelType}
                currentUserId={currentUserId}
                currentUsername={currentUsername}
                isOwner={isOwner}
            />

            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}
