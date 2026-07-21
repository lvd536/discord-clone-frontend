'use client';

import { useState } from 'react';

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import UserVoiceControls from '@/features/shared/components/UserVoiceControls';
import UserVoiceControlsPortal from '@/features/shared/components/UserVoiceControlsPortal';
import VoiceChannelInterface from '@/features/voice/components/VoiceChannelInterface';
import VoiceStatusPortal from '@/features/voice/components/VoiceStatusPortal';
import VoiceStatusWidget from '@/features/voice/components/VoiceStatusWidget';

import DirectChatArea from './DirectChatArea';

interface IProps {
    channelId: string;
    accessToken: string;
    channelName: string;
}

export default function DirectTextChannel({ channelId, accessToken, channelName }: IProps) {
    const [inCall, setInCall] = useState(false);
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'ws://localhost:7880';

    return (
        <LiveKitRoom
            video={false}
            audio={false}
            screen={false}
            token={accessToken}
            serverUrl={serverUrl}
            connect={true}
            className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white"
        >
            {inCall ? (
                <div className="flex h-full flex-1 flex-col overflow-hidden">
                    <UserVoiceControlsPortal>
                        <UserVoiceControls />
                    </UserVoiceControlsPortal>
                    <VoiceStatusPortal>
                        <VoiceStatusWidget
                            channelName={channelName}
                            onDisconnect={() => setInCall(false)}
                        />
                    </VoiceStatusPortal>

                    <div className="flex h-[45%] min-h-65 flex-col border-b border-[#1f2023] bg-[#2b2d31]">
                        <VoiceChannelInterface
                            channelId={channelName}
                            onLeave={() => setInCall(false)}
                            autoStartMic={true}
                        />
                    </div>

                    <div className="min-h-0 flex-1">
                        <DirectChatArea
                            conversationId={channelId}
                            channelName={channelName}
                            inCallMode={true}
                        />
                    </div>
                </div>
            ) : (
                <DirectChatArea
                    conversationId={channelId}
                    channelName={channelName}
                    onStartCall={() => setInCall(true)}
                />
            )}

            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}
