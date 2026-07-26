'use client';

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import { UserVoiceControls, UserVoiceControlsPortal } from '@/features/shared/components';
import { useVoiceStore } from '@/features/shared/store/voice.store';
import {
    VoiceChannelLifecycleManager,
    VoiceStatusPortal,
    VoiceStatusWidget,
} from '@/features/voice/components';

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
