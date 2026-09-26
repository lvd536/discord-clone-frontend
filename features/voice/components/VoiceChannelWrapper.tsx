'use client';

import { useState } from 'react';

import { joinChannel } from '@/features/shared/actions';
import { useVoiceStore } from '@/features/shared/store/voice.store';
import { getErrorMessage } from '@/lib/errors';
import VoiceChannel from "@/features/voice/components/VoiceChannel";

interface VoiceChannelWrapperProps {
    serverId: string;
    channelId: string;
    channelName: string;
}

export default function VoiceChannelWrapper({
    serverId,
    channelId,
    channelName,
}: VoiceChannelWrapperProps) {
    const { activeChannelId, isConnected, connect } = useVoiceStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isCurrentChannelConnected = isConnected && activeChannelId === channelId;

    const handleJoinVoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const joinResponse = await joinChannel({ channelId, serverId });

            if (joinResponse.success) {
                const data = joinResponse.data;

                connect({ channelId, channelName, token: data.token, serverId });
            }
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col bg-[#313338]">
            {!isCurrentChannelConnected ? (
                <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-md rounded-lg border border-[#1f2023]/60 bg-[#2b2d31] p-8 shadow-lg">
                        <h1 className="mb-2 text-2xl font-bold text-white">
                            Голосовой канал: {channelName}
                        </h1>
                        <p className="mb-6 text-sm text-[#949ba4]">
                            Нажмите кнопку ниже для подключения к WebRTC комнате.
                        </p>

                        {error && <p className="mb-4 text-xs text-[#f23f43]">{error}</p>}

                        <button
                            onClick={handleJoinVoice}
                            disabled={loading}
                            className="w-full cursor-pointer rounded bg-[#5865f2] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#4752c4] disabled:bg-[#35363c]"
                        >
                            {loading ? 'Подключение...' : `Подключиться к ${channelName}`}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <VoiceChannel channelId={channelName} />
                </div>
            )}
        </div>
    );
}
