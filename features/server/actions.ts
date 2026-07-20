'use server';

import { Server } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { ServerInfoResponse } from '../shared/types/channel.types';

export const joinServer = createSafeAction(async (inviteCode: string) => {
    const response = await api.post(`/servers/join?inviteCode=${inviteCode}`);

    return response.data;
});

export const editServer = createSafeAction(
    async (server: { name: string; imageUrl: string }, serverId: string) => {
        const response = await api.patch(`/servers?serverId=${serverId}`, server);

        return response.data;
    },
);

export const deleteServer = createSafeAction(async (serverId: string) => {
    const response = await api.delete(`/servers?serverId=${serverId}`);

    return response.data;
});

export const createServer = createSafeAction(async (server: { name: string; imageUrl: string }) => {
    const response = await api.post(`/servers`, server);

    return response.data;
});

export const getServerInfo = createSafeAction(async (serverId: string) => {
    const response = await api.get(`/servers/${serverId}`);

    return response.data as ServerInfoResponse;
});

export const getUserServers = createSafeAction(async () => {
    const response = await api.get('/servers');

    return response.data as Server[];
});
