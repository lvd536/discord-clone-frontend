'use client';

import { useLayoutEffect, useState } from 'react';

import { LiveKitRoom } from '@livekit/components-react';

import { joinChannel } from '@/features/shared/actions';
import { serverUrl } from '@/features/shared/constants/livekit.constants';
import { getErrorMessage } from '@/lib/errors';

import ChatArea from './ChatArea';

interface IProps {
    serverId: string;
    channelId: string;
    channelName: string;
}

export default function TextChannel({ channelName, serverId, channelId }: IProps) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useLayoutEffect(() => {
        const getToken = async () => {
            setLoading(true);
            setError(null);
            try {
                const joinResponse = await joinChannel({ channelId, serverId });

                if (joinResponse.success) {
                    const data = joinResponse.data;
                    setToken(data.token);
                }
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        getToken();
    }, [serverId, channelId]);

    return (
        <>
            {loading ? (
                <span>Загрузка...</span>
            ) : error ? (
                <span className="text-red-500">{error}</span>
            ) : token ? (
                <LiveKitRoom
                    key={channelId}
                    video={false}
                    audio={false}
                    screen={false}
                    token={token}
                    serverUrl={serverUrl}
                    connect={true}
                    className="flex h-full flex-1 flex-col bg-[#313338] text-white"
                >
                    <ChatArea serverId={serverId} channelId={channelId} channelName={channelName} />
                </LiveKitRoom>
            ) : (
                <span>Произошла непредвиденная ошибка</span>
            )}
        </>
    );
}
