'use client';

import { useEffect, useRef, useState } from 'react';

import { useChat } from '@livekit/components-react';
import { toast } from 'sonner';

import { useNotificationStore } from '@/features/notifications/store/notification.store';
import { NOTIFICATION_TYPE } from '@/features/notifications/types/notification.types';
import { getErrorMessage } from '@/lib/errors';

import { createMessage, editMessage, getMessageHistory } from '../actions';
import { INormalizedMessage } from '../types/message.types';

interface UseServerChatMessagesProps {
    serverId: string;
    channelId: string;
    channelName: string;
    currentUserId?: string;
    currentUserName?: string;
}

export function useServerChatMessages({
    serverId,
    channelId,
    channelName,
    currentUserId,
    currentUserName,
}: UseServerChatMessagesProps) {
    const { chatMessages, send, isSending } = useChat();
    const sendNotification = useNotificationStore((s) => s.sendNotification);

    const [history, setHistory] = useState<INormalizedMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getMessageHistory({ serverId, channelId });
                const dbMessages = res.success ? res.data : [];

                const normalized: INormalizedMessage[] = dbMessages.map((msg) => ({
                    id: msg.id,
                    senderId: msg.member?.user?.id,
                    senderName: msg.member.user.displayName,
                    avatarUrl: msg.member.user.avatarUrl,
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).getTime(),
                }));

                setHistory(normalized);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(`Ошибка при получении истории сообщений: ${err.message}`);
                } else {
                    toast.error('Произошла непредвиденная ошибка');
                }
            }
        };

        fetchHistory();
    }, [serverId, channelId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, chatMessages]);

    const handleSendMessage = async (content: string) => {
        try {
            await send(content);
            await createMessage({ serverId, channelId, content });

            sendNotification({
                channelId: `servers:${serverId}`,
                message: content,
                type: NOTIFICATION_TYPE.NEW_MESSAGE_NOTIFICATION,
                metadata: {
                    serverId,
                    channelName,
                    senderId: currentUserId,
                    senderName: currentUserName || 'Пользователь',
                },
            });
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        }
    };

    const handleEditMessage = async (messageId: string, content: string) => {
        const res = await editMessage({ serverId, channelId, messageId, content });
        if (res.success) {
            setHistory((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, content, isUpdated: true } : m)),
            );
        } else {
            throw new Error(res.error);
        }
    };

    const livekitMessages: INormalizedMessage[] = chatMessages.map((msg) => {
        let avatarUrl = '';
        if (msg.from?.metadata) {
            try {
                const parsedMetadata = JSON.parse(msg.from.metadata);
                avatarUrl = parsedMetadata.avatar || '';
            } catch (error) {
                console.error('Ошибка парсинга метаданных LiveKit:', error);
            }
        }

        return {
            id: `${msg.timestamp}-${msg.from?.identity}`,
            senderId: msg.from?.identity,
            senderName: msg.from?.name || msg.from?.identity || 'Unknown',
            avatarUrl,
            content: msg.message,
            timestamp: msg.timestamp,
        };
    });

    livekitMessages.reverse();
    const allMessages = [...livekitMessages, ...history];

    return {
        allMessages,
        sendMessage: handleSendMessage,
        editMessage: handleEditMessage,
        isSending,
        chatEndRef,
    };
}
