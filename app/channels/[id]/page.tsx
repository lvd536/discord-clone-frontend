'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import VoiceChannel from '@/features/voice/components/VoiceChannel';
import { api } from '@/lib/api/api';

export default function ChannelPage() {
    const params = useParams();
    const channelId = params.id as string;

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinVoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/livekit/join', {
                channelId: channelId,
            });

            const data = await response.data;
            console.log(response);
            setToken(data.token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1f22] p-6">
            {!token ? (
                <div className="w-full max-w-xl rounded-2xl bg-[#2b2d31] p-6 text-center text-white">
                    <h1 className="mb-4 text-xl font-bold">Голосовой канал</h1>
                    <p className="mb-6 text-sm text-gray-400">
                        Нажмите кнопку ниже, чтобы подключиться к WebRTC комнате.
                    </p>

                    {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

                    <button
                        onClick={handleJoinVoice}
                        disabled={loading}
                        className="w-full rounded-lg bg-[#5865f2] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4752c4] disabled:bg-gray-600"
                    >
                        {loading ? 'Подключение...' : 'Войти в канал'}
                    </button>
                </div>
            ) : (
                <div className="h-125 w-full max-w-4xl">
                    <VoiceChannel channelId={channelId} accessToken={token} />

                    <button
                        onClick={() => setToken(null)}
                        className="mt-4 text-xs text-gray-400 transition-colors hover:text-white"
                    >
                        Выйти из интерфейса комнаты
                    </button>
                </div>
            )}
        </div>
    );
}
