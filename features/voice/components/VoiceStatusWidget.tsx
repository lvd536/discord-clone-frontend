'use client';

import { useState } from 'react';

import { useConnectionState, useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { Headphones, Mic, MicOff, PhoneOff } from 'lucide-react';

interface IProps {
    channelName: string;
    onDisconnect: () => void;
}

export default function VoiceStatusWidget({ channelName, onDisconnect }: IProps) {
    const room = useRoomContext();
    const { localParticipant } = useLocalParticipant();
    const connectionState = useConnectionState();

    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    const handleToggleMute = () => {
        const nextState = !isMuted;
        setIsMuted(nextState);
        room.localParticipant.setMicrophoneEnabled(!nextState);
    };

    const handleToggleDeafen = () => {
        const nextState = !isDeafened;
        setIsDeafened(nextState);
        if (nextState) {
            room.localParticipant.setMicrophoneEnabled(false);
            setIsMuted(true);
        } else {
            room.localParticipant.setMicrophoneEnabled(true);
            setIsMuted(false);
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
                        {channelName}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onDisconnect}
                        className="cursor-pointer rounded p-1.5 text-[#f23f43] transition-colors hover:bg-[#35363c]"
                        title="Отключиться"
                    >
                        <PhoneOff className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-1 flex items-center justify-between rounded bg-[#232428] px-2 py-1.5">
                <div className="flex max-w-27.5 items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold">
                        {localParticipant.identity.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-xs font-bold text-[#f2f3f5]">
                            {localParticipant.name || localParticipant.identity}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-0.5">
                    <button
                        onClick={handleToggleMute}
                        className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                            isMuted ? 'text-[#f23f43]' : 'text-[#dbdee1]'
                        }`}
                    >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={handleToggleDeafen}
                        className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                            isDeafened ? 'text-[#f23f43]' : 'text-[#dbdee1]'
                        }`}
                    >
                        <Headphones className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
