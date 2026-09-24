'use client';

import { useEffect, useRef, useState } from 'react';

import { ConversationType } from '@backend/types/__generated__/enums';
import { useChat, useParticipants } from '@livekit/components-react';
import { Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

import {
    deleteDirectMessage,
    editDirectMessage,
    getDirectMessages,
    sendDirectMessage,
} from '@/features/direct-chat/actions';
import { GroupActions } from '@/features/direct-chat/components';
import { useNotificationStore } from '@/features/notifications/store/notification.store';
import { NOTIFICATION_TYPE } from '@/features/notifications/types/notification.types';

import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { INormalizedMessage } from '../types/message.types';
import ChatAreaMessage from './ChatAreaMessage';
import TypingIndicator from './TypingIndicator';

interface IProps {
    conversationId: string;
    channelName: string;
    channelType: ConversationType;
    currentUserId: string;
    currentUsername: string;
    isOwner: boolean;
    onStartCall?: () => void;
    inCallMode?: boolean;
}

export default function DirectChatArea({
    channelName,
    conversationId,
    currentUserId,
    currentUsername,
    onStartCall,
    inCallMode,
    channelType,
    isOwner,
}: IProps) {
    const { sendTyping, typingNames } = useTypingIndicator(currentUserId, currentUsername);
    const sendNotification = useNotificationStore((state) => state.sendNotification);
    const { chatMessages, send, isSending } = useChat();
    const participants = useParticipants();

    const [history, setHistory] = useState<INormalizedMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const otherParticipants = participants.filter((p) => !p.isLocal);
    const isCallActiveInRoom = otherParticipants.some((p) => p.isMicrophoneEnabled);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getDirectMessages(conversationId);
                const dbMessages = res.success ? res.data : [];

                const normalized = dbMessages.map((msg) => ({
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
                } else toast.error('Произошла непредвиденная ошибка');
            }
        };

        fetchHistory();
    }, [conversationId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, chatMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending) return;

        const content = inputValue;
        setInputValue('');

        try {
            await send(content);
            await sendDirectMessage({ conversationId, content });

            sendNotification({
                channelId: `conversations:${conversationId}`,
                message: content,
                type: NOTIFICATION_TYPE.NEW_MESSAGE_NOTIFICATION,
                metadata: {
                    conversationId,
                    senderId: currentUserId,
                    senderName: currentUsername || 'Пользователь',
                },
            });
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Ошибка при отправке сообщения: ${err.message}`);
            } else toast.error('Произошла непредвиденная ошибка');
        }
    };

    const handleEditMessage = async (messageId: string, content: string) => {
        const res = await editDirectMessage({ conversationId, messageId, content });
        if (res.success) {
            setHistory((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, content, isUpdated: true } : m)),
            );
        } else {
            throw new Error(res.error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
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

    return (
        <div className="flex h-full flex-1 flex-col bg-[#313338] text-white">
            <div
                className={`flex h-12 w-full shrink-0 items-center justify-between bg-[#313338] px-4 ${!inCallMode && 'border-b border-[#1f2023]'}`}
            >
                {!inCallMode && onStartCall && (
                    <>
                        <span className="font-bold text-[#f2f3f5]">{channelName}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onStartCall}
                                className="cursor-pointer rounded p-1.5 text-[#b5bac1] transition-all hover:bg-[#35363c]/60 hover:text-[#dbdee1]"
                                title="Начать голосовой звонок"
                            >
                                <Phone size={18} />
                            </button>
                            <GroupActions
                                conversationName={channelName}
                                channelType={channelType}
                                conversationId={conversationId}
                                isOwner={isOwner}
                            />
                        </div>
                    </>
                )}
            </div>

            {!inCallMode && isCallActiveInRoom && onStartCall && (
                <div className="animate-in fade-in slide-in-from-top-2 flex shrink-0 items-center justify-between bg-[#23a55a] px-4 py-2 text-sm text-white select-none">
                    <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 animate-ping rounded-full bg-white" />В этом чате
                        запущен голосовой звонок!
                    </span>
                    <button
                        onClick={onStartCall}
                        className="cursor-pointer rounded bg-white px-3 py-1 text-xs font-bold text-[#23a55a] transition-colors hover:bg-gray-100"
                    >
                        Присоединиться
                    </button>
                </div>
            )}

            <div className="discord-scroll flex flex-1 flex-col-reverse overflow-y-auto p-4">
                {allMessages.map((msg, index) => (
                    <ChatAreaMessage
                        message={msg}
                        chatEndRef={index === 1 ? chatEndRef : undefined}
                        currentUserId={currentUserId}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        key={msg.id}
                    />
                ))}
            </div>

            <TypingIndicator names={typingNames} />

            <form onSubmit={handleSendMessage} className="shrink-0 bg-[#313338] p-4">
                <div className="relative flex items-center rounded-lg bg-[#383a40] px-4 py-2.5">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            sendTyping();
                        }}
                        placeholder={`Отправить сообщение в #${channelName}`}
                        className="w-full bg-transparent text-sm text-[#dbdee1] placeholder-[#80848e] focus:outline-none"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !inputValue.trim()}
                        className="cursor-pointer text-[#b5bac1] transition-colors hover:text-[#dbdee1] disabled:opacity-40"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
