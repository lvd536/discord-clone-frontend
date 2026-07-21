'use client';

import { useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { PhoneOff } from 'lucide-react';

interface IProps {
    channelName?: string;
    onDisconnect?: () => void;
}

export default function VoiceStatusWidget({ channelName, onDisconnect }: IProps) {
    const room = useRoomContext();
    const connectionState = useConnectionState();

    const handleLeaveVoice = async () => {
        try {
            await room.localParticipant.setMicrophoneEnabled(false);
            await room.localParticipant.setCameraEnabled(false);
            await room.localParticipant.setScreenShareEnabled(false);

            room.remoteParticipants.forEach((participant) => {
                participant.trackPublications.forEach((publication) => {
                    if (publication.isSubscribed) {
                        publication.setEnabled(false);
                    }
                });
            });

            if (onDisconnect) onDisconnect();
        } catch (error) {
            console.error('Ошибка при выходе из голосового звонка:', error);
        }
    };

    const getConnectionStatus = () => {
        switch (connectionState) {
            case ConnectionState.Connected:
                return {
                    text: 'Голос подключен',
                    color: 'text-[#23a55a]',
                    dotColor: 'bg-[#23a55a]',
                };
            case ConnectionState.Reconnecting:
                return {
                    text: 'Переподключение...',
                    color: 'text-[#fee75c]',
                    dotColor: 'bg-[#fee75c]',
                };
            case ConnectionState.Connecting:
                return {
                    text: 'Подключение...',
                    color: 'text-[#5865f2]',
                    dotColor: 'bg-[#5865f2]',
                };
            default:
                return {
                    text: 'Подключение...',
                    color: 'text-[#949ba4]',
                    dotColor: 'bg-[#949ba4]',
                };
        }
    };

    const status = getConnectionStatus();

    if (!room) return null;

    return (
        <div className="flex flex-col border-b border-[#1f2023] bg-[#232428] p-2">
            <div className="flex items-center justify-between px-2 py-1">
                <div className="flex flex-col">
                    <span className={`flex items-center gap-1 text-xs font-bold ${status.color}`}>
                        <span
                            className={`h-2 w-2 rounded-full ${status.dotColor} ${connectionState === ConnectionState.Reconnecting ? 'animate-ping' : 'animate-pulse'}`}
                        ></span>
                        {status.text}
                    </span>
                    <span className="max-w-30 truncate text-[11px] text-[#949ba4]">
                        {channelName ?? room.name}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleLeaveVoice}
                        className="cursor-pointer rounded p-1.5 text-[#f23f43] transition-colors hover:bg-[#35363c]"
                        title="Отключиться"
                    >
                        <PhoneOff className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
