'use client';

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import UserVoiceControls from '@/features/shared/components/UserVoiceControls';
import UserVoiceControlsPortal from '@/features/shared/components/UserVoiceControlsPortal';
import { useVoiceStore } from '@/features/shared/store/voice.store';
import VoiceChannelLifecycleManager from '@/features/voice/components/VoiceChannelLifecycleManager';
import VoiceStatusPortal from '@/features/voice/components/VoiceStatusPortal';
import VoiceStatusWidget from '@/features/voice/components/VoiceStatusWidget';

export default function GlobalVoiceProvider({ children }: { children: React.ReactNode }) {
    const { activeChannelId, activeChannelName, token, isConnected, disconnect } = useVoiceStore();
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'ws://localhost:7880';

    if (isConnected && token && activeChannelId) {
        return (
            <LiveKitRoom
                key={activeChannelId}
                video={true}
                audio={true}
                screen={true}
                token={token}
                serverUrl={serverUrl}
                connect={true}
                className="contents"
            >
                <UserVoiceControlsPortal>
                    <UserVoiceControls />
                </UserVoiceControlsPortal>

                <VoiceStatusPortal>
                    <VoiceStatusWidget
                        channelName={activeChannelName || activeChannelId}
                        onDisconnect={disconnect}
                    />
                </VoiceStatusPortal>

                <VoiceChannelLifecycleManager onLeave={disconnect} />

                <RoomAudioRenderer />

                {children}
            </LiveKitRoom>
        );
    }

    return <>{children}</>;
}
