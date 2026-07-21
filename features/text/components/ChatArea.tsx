'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { useChat } from '@livekit/components-react';
import { Hash, Send } from 'lucide-react';
import { toast } from 'sonner';

import { createMessage, getMessageHistory } from '../actions';

interface IProps {
    serverId: string;
    channelId: string;
    channelName: string;
}

interface INormalizedMessage {
    id: string;
    senderName: string;
    avatarUrl: string | null;
    content: string;
    timestamp: number;
}

export default function ChatArea({ channelName, channelId, serverId }: IProps) {
    const { chatMessages, send, isSending } = useChat();
    const [history, setHistory] = useState<INormalizedMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getMessageHistory(serverId, channelId);
                const dbMessages = res.success ? res.data : [];

                const normalized = dbMessages.map((msg) => ({
                    id: msg.id,
                    senderName: msg.member.user.displayName,
                    avatarUrl: msg.member.user.avatarUrl,
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).getTime(),
                }));

                setHistory(normalized);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(`Ошибка при получении истории сообщений: ${err.message}`);
                } else toast.error('Произошла непредвиденная ошибка');
            }
        };

        fetchHistory();
    }, [serverId, channelId]);

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

            await createMessage(serverId, channelId, content);
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Ошибка при отправке сообщения: ${err.message}`);
            } else toast.error('Произошла непредвиденная ошибка');
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
            avatarUrl,
            content: msg.message,
            timestamp: msg.timestamp,
        };
    });

    livekitMessages.reverse();

    const allMessages = [...livekitMessages, ...history];

    return (
        <div className="flex h-full flex-1 flex-col bg-[#313338] text-white">
            <div className="flex h-12 w-full items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4">
                <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-[#80848e]" />
                    <span className="font-bold text-[#f2f3f5]">{channelName}</span>
                </div>
            </div>

            <div className="discord-scroll flex flex-1 flex-col-reverse overflow-y-auto p-4">
                {allMessages.map((msg, index) => {
                    const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    const initials = msg.senderName.substring(0, 2).toUpperCase();

                    return (
                        <div
                            key={msg.id}
                            className="group flex items-start gap-4 rounded p-1.5 transition-all hover:bg-[#2e3035]/30"
                        >
                            {msg.avatarUrl ? (
                                <Image
                                    src={msg.avatarUrl}
                                    alt={msg.senderName}
                                    width={640}
                                    height={640}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                                    {initials}
                                </div>
                            )}

                            <div className="flex flex-col overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer text-sm font-semibold text-[#f2f3f5] hover:underline">
                                        {msg.senderName}
                                    </span>
                                    <span className="text-[10px] text-[#949ba4]">{timeString}</span>
                                </div>
                                <p className="wrap-break-words mt-0.5 text-sm whitespace-pre-wrap text-[#dbdee1]">
                                    {msg.content}
                                </p>
                            </div>
                            {index === 1 && <div ref={chatEndRef} />}
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSendMessage} className="bg-[#313338] p-4">
                <div className="relative flex items-center rounded-lg bg-[#383a40] px-4 py-2.5">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
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
