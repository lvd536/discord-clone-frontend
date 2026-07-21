'use client';

import { useState } from 'react';

import { joinChannel } from '@/features/shared/actions';
import VoiceChannel from '@/features/voice/components/VoiceChannel';

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
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinVoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const joinResponse = await joinChannel(channelId, serverId);
            console.log(joinResponse);
            if (joinResponse.success) {
                const data = joinResponse.data;
                console.log(data);
                setToken(data.token);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveVoice = () => {
        setToken(null);
    };

    return (
        <div className="flex flex-1 flex-col bg-[#313338]">
            {!token ? (
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
                    <VoiceChannel
                        channelId={channelId}
                        accessToken={token}
                        onLeave={handleLeaveVoice}
                    />
                </div>
            )}
        </div>
    );
}
