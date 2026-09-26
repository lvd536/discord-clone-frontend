'use client';

import { useEffect, useRef, useState } from 'react';

import { useChat } from '@livekit/components-react';
import { toast } from 'sonner';

import {
    deleteDirectMessage,
    editDirectMessage,
    getDirectMessages,
    sendDirectMessage,
} from '@/features/direct-chat/actions';
import { useNotificationStore } from '@/features/notifications/store/notification.store';
import { NOTIFICATION_TYPE } from '@/features/notifications/types/notification.types';

import { INormalizedMessage } from '../types/message.types';

interface UseDirectChatMessagesProps {
    conversationId: string;
}

export function useDirectChatMessages({ conversationId }: UseDirectChatMessagesProps) {
    const { chatMessages, send, isSending } = useChat();
    const sendNotification = useNotificationStore((state) => state.sendNotification);

    const [history, setHistory] = useState<INormalizedMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getDirectMessages(conversationId);
                const dbMessages = res.success ? res.data : [];

                const normalized: INormalizedMessage[] = dbMessages.map((msg) => ({
                    id: msg.id,
                    senderName: msg.sender.displayName,
                    avatarUrl: msg.sender.avatarUrl,
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).getTime(),
                    senderId: msg.senderId,
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
    }, [conversationId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, chatMessages]);

    const sendMessage = async (content: string) => {
        try {
            await send(content);
            await sendDirectMessage({ conversationId, content });

            sendNotification({
                channelId: `users:${conversationId}`,
                message: content,
                type: NOTIFICATION_TYPE.NEW_MESSAGE_NOTIFICATION,
            });
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Ошибка при отправке сообщения: ${err.message}`);
            } else {
                toast.error('Произошла непредвиденная ошибка');
            }
            throw err;
        }
    };

    const editMessage = async (messageId: string, content: string) => {
        const res = await editDirectMessage({ conversationId, messageId, content });
        if (res.success) {
            setHistory((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, content, isUpdated: true } : m)),
            );
        } else {
            throw new Error(res.error);
        }
    };

    const deleteMessage = async (messageId: string) => {
        const res = await deleteDirectMessage({ conversationId, messageId });
        if (res.success) {
            setHistory((prev) => prev.filter((m) => m.id !== messageId));
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
            senderName: msg.from?.name || msg.from?.identity || 'Unknown',
            senderId: msg.from?.identity,
            avatarUrl,
            content: msg.message,
            timestamp: msg.timestamp,
        };
    });

    livekitMessages.reverse();
    const allMessages = [...livekitMessages, ...history];

    return {
        allMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        isSending,
        chatEndRef,
    };
}
