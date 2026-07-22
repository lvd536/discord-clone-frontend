'use client';

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import UserVoiceControls from '@/features/shared/components/UserVoiceControls';
import UserVoiceControlsPortal from '@/features/shared/components/UserVoiceControlsPortal';

import VoiceChannelInterface from './VoiceChannelInterface';
import VoiceChannelLifecycleManager from './VoiceChannelLifecycleManager';
import VoiceStatusPortal from './VoiceStatusPortal';
import VoiceStatusWidget from './VoiceStatusWidget';

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
            <UserVoiceControlsPortal>
                <UserVoiceControls />
            </UserVoiceControlsPortal>

            <VoiceStatusPortal>
                <VoiceStatusWidget channelName={channelId} onDisconnect={onLeave} />
            </VoiceStatusPortal>

            <VoiceChannelLifecycleManager onLeave={onLeave} />

            <VoiceChannelInterface channelId={channelId} />

            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}
