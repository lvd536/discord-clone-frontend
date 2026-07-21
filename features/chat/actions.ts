'use server';

import { revalidatePath } from 'next/cache';

import { DirectMessage } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import {
    ChatResponseType,
    DirectMessageHistoryType,
    DirectMessageResponse,
    UserConversationsType,
} from './types/chat.types';

export const getUserConversations = createSafeAction(async () => {
    const response = await api.get('/conversations');
    return response.data as UserConversationsType;
});

export const getOrCreateDM = createSafeAction(async (friendId: string) => {
    const response = await api.post(`/conversations/dm/${friendId}`);
    return response.data as ChatResponseType;
});

export const createGroupConversation = createSafeAction(
    async ({ name, friendIds }: { name: string; friendIds: string[] }) => {
        const response = await api.post('/conversations/group', { name, friendIds });
        revalidatePath('/dashboard/me');
        return response.data as ChatResponseType;
    },
);

export const getDirectMessages = createSafeAction(async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}/direct-messages`);
    return response.data as DirectMessageHistoryType;
});

export const sendDirectMessage = createSafeAction(
    async ({ conversationId, content }: { conversationId: string; content: string }) => {
        const response = await api.post(`/conversations/${conversationId}/direct-messages`, {
            content,
        });
        return response.data as DirectMessageResponse;
    },
);

export const editDirectMessage = createSafeAction(
    async ({
        conversationId,
        messageId,
        content,
    }: {
        conversationId: string;
        messageId: string;
        content: string;
    }) => {
        const response = await api.patch(
            `/conversations/${conversationId}/direct-messages/${messageId}`,
            { content },
        );
        return response.data as DirectMessageResponse;
    },
);

export const deleteDirectMessage = createSafeAction(
    async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
        const response = await api.delete(
            `/conversations/${conversationId}/direct-messages/${messageId}`,
        );
        return response.data as DirectMessage;
    },
);
