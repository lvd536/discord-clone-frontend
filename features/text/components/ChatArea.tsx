'use client';

import { useEffect, useRef, useState } from 'react';

import { useChat } from '@livekit/components-react';
import { Hash, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

import { getServerMembers } from '@/features/server/actions';
import MembersSheet from '@/features/server/components/MembersSheet';
import { ServerMembersType } from '@/features/shared/types/channel.types';

import { createMessage, getMessageHistory } from '../actions';
import { INormalizedMessage } from '../types/message.types';
import ChatAreaMessage from './ChatAreaMessage';

interface IProps {
    serverId: string;
    channelId: string;
    channelName: string;
}

export default function ChatArea({ channelName, channelId, serverId }: IProps) {
    const { chatMessages, send, isSending } = useChat();
    const [history, setHistory] = useState<INormalizedMessage[]>([]);
    const [members, setMembers] = useState<ServerMembersType>([]);
    const [isMembersOpen, setIsMembersOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchServerData = async () => {
            try {
                const [historyResponse, membersResponse] = await Promise.all([
                    await getMessageHistory(serverId, channelId),
                    await getServerMembers(serverId),
                ]);
                const dbMessages = historyResponse.success ? historyResponse.data : [];
                const dbMembers = membersResponse.success ? membersResponse.data : [];

                const normalized = dbMessages.map((msg) => ({
                    id: msg.id,
                    senderName: msg.member.user.displayName,
                    avatarUrl: msg.member.user.avatarUrl,
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).getTime(),
                }));

                setHistory(normalized);
                setMembers(dbMembers);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(`Ошибка при получении истории сообщений: ${err.message}`);
                } else toast.error('Произошла непредвиденная ошибка');
            }
        };

        fetchServerData();
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
        <div className="flex h-screen max-h-screen w-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <div className="flex h-12 min-h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4">
                <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-[#80848e]" />
                    <span className="font-bold text-[#f2f3f5]">{channelName}</span>
                </div>
                <button className="md:hidden" onClick={() => setIsMembersOpen((prev) => !prev)}>
                    <Users size={24} />
                </button>
            </div>

            <div className="flex h-[calc(100vh-48px)] w-full items-stretch overflow-hidden">
                <div className="flex h-full min-w-0 flex-1 flex-col bg-[#313338]">
                    <div className="discord-scroll flex flex-1 flex-col-reverse overflow-y-auto p-4">
                        {allMessages.map((msg, index) => (
                            <ChatAreaMessage
                                message={msg}
                                chatEndRef={index === 0 ? chatEndRef : undefined}
                                key={msg.id}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="shrink-0 bg-[#313338] p-4">
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

                <MembersSheet
                    members={members}
                    open={isMembersOpen}
                    onOpenChange={(state) => setIsMembersOpen(state)}
                />
            </div>
        </div>
    );
}
