'use server';

import { revalidatePath } from 'next/cache';

import { Channel, ChannelType } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { ChannelResponse } from './types/channel.types';

export const createChannel = createSafeAction(
    async ({ serverId, name, type }: { serverId: string; name: string; type: ChannelType }) => {
        const response = await api.post(`/servers/${serverId}/channels`, { name, type });

        return response.data as ChannelResponse;
    },
);

export const getChannelInfo = createSafeAction(
    async ({ serverId, channelId }: { serverId: string; channelId: string }) => {
        const response = await api.get(`/servers/${serverId}/channels/${channelId}`);

        return response.data as Channel;
    },
);

export const joinChannel = createSafeAction(
    async ({ channelId, serverId }: { channelId: string; serverId?: string }) => {
        const response = await api.post('/livekit/join', {
            serverId,
            channelId,
        });

        return response.data;
    },
);

export const deleteChannel = createSafeAction(
    async ({ serverId, channelId }: { serverId: string; channelId: string }) => {
        const response = await api.delete(`/servers/${serverId}/channels/${channelId}`);
        revalidatePath(`/dashboard/server/${serverId}`);
        return response.data;
    },
);
