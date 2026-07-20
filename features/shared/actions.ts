'use server';

import { Channel, ChannelType } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { ChannelResponse } from './types/channel.types';

export const createChannel = createSafeAction(
    async (serverId: string, name: string, type: ChannelType) => {
        const response = await api.post(`/servers/${serverId}/channels`, { name, type });

        return response.data as ChannelResponse;
    },
);

export const getChannelInfo = createSafeAction(async (serverId: string, channelId: string) => {
    const response = await api.get(`/servers/${serverId}/channels/${channelId}`);

    return response.data as Channel;
});

export const joinChannel = createSafeAction(async (channelId: string, serverId?: string) => {
    const response = await api.post('/livekit/join', {
        serverId,
        channelId,
    });

    return response.data;
});
