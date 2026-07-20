'use server';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { MessageHistoryResponse, MessageResponse } from './types/message.types';

const endpointBase = (serverId: string, channelId: string) =>
    `/servers/${serverId}/channels/${channelId}/messages`;

export const createMessage = createSafeAction(
    async (serverId: string, channelId: string, content: string) => {
        const response = await api.post(endpointBase(serverId, channelId), {
            content,
        });

        return response.data as MessageResponse;
    },
);

export const editMessage = createSafeAction(
    async (serverId: string, channelId: string, messageId: string, content: string) => {
        const response = await api.patch(
            endpointBase(serverId, channelId) + `/?messageId=${messageId}`,
            { content },
        );

        return response.data as MessageResponse;
    },
);

export const getMessageHistory = createSafeAction(async (serverId: string, channelId: string) => {
    const response = await api.get(endpointBase(serverId, channelId));

    return response.data as MessageHistoryResponse;
});
