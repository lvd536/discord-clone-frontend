'use client';
import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import CustomParticipantsList from './CustomParticipantsList';
import VoiceStreamsGrid from './VoiceStreamsGrid';

interface IProps {
    channelId: string;
    accessToken: string;
}

export default function VoiceChannel({ channelId, accessToken }: IProps) {
    const serverUrl = 'ws://localhost:7880';

    return (
        <div className="flex h-full flex-col rounded-lg bg-[#313338] p-4 text-white">
            <h2 className="mb-4 text-lg font-bold">Голосовой канал: {channelId}</h2>

            <LiveKitRoom
                video={false}
                audio={true}
                screen={false}
                token={accessToken}
                serverUrl={serverUrl}
                connect={true}
                data-lk-theme="default"
                className="flex flex-1 flex-col justify-between"
            >
                <div className="grid flex-1 grid-cols-2 items-start gap-4 overflow-y-auto md:grid-cols-4">
                    <CustomParticipantsList />
                </div>

                <div className="mb-4 min-h-0 flex-1 overflow-y-auto">
                    <VoiceStreamsGrid />
                </div>

                <RoomAudioRenderer />

                <div className="mt-4 flex justify-center rounded-xl bg-[#2b2d31] p-2">
                    <ControlBar
                        controls={{
                            microphone: true,
                            camera: true,
                            screenShare: true,
                            leave: true,
                        }}
                    />
                </div>
            </LiveKitRoom>
        </div>
    );
}
