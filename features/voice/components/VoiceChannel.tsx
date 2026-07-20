'use client';

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import VoiceChannelInterface from './VoiceChannelInterface';
import VoiceChannelLifecycleManager from './VoiceChannelLifecycleManager';

interface IProps {
    channelId: string;
    accessToken: string;
    onLeave: () => void;
}

export default function VoiceChannel({ channelId, accessToken, onLeave }: IProps) {
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'ws://localhost:7880';

    return (
        <LiveKitRoom
            key={channelId}
            video={true}
            audio={true}
            screen={true}
            token={accessToken}
            serverUrl={serverUrl}
            connect={true}
            className="flex h-full flex-1 flex-col bg-[#313338] text-white"
        >
            <VoiceChannelLifecycleManager onLeave={onLeave} />

            <VoiceChannelInterface channelId={channelId} onLeave={onLeave} />

            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}
