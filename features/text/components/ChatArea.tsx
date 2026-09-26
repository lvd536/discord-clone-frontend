'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { getServerMembers } from '@/features/server/actions';
import { MembersSheet } from '@/features/server/components';
import { ServerMembersType } from '@/features/shared/types/channel.types';

import { useServerChatMessages } from '../hooks/useServerChatMessages';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import ChatAreaHeader from './ChatAreaHeader';
import ChatAreaMessage from './ChatAreaMessage';
import ChatInputForm from './ChatInputForm';
import TypingIndicator from './TypingIndicator';

interface IProps {
    serverId: string;
    channelId: string;
    channelName: string;
}

export default function ChatArea({ channelName, channelId, serverId }: IProps) {
    const { profile } = useAuthStore();

    const { allMessages, sendMessage, editMessage, isSending, chatEndRef } = useServerChatMessages({
        serverId,
        channelId,
        channelName,
        currentUserId: profile?.id,
        currentUserName: profile?.displayName,
    });

    const { sendTyping, typingNames } = useTypingIndicator(profile?.id, profile?.displayName);

    const [members, setMembers] = useState<ServerMembersType>([]);
    const [isMembersOpen, setIsMembersOpen] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getServerMembers(serverId);
                if (res.success && res.data) setMembers(res.data);
            } catch (err) {
                if (err instanceof Error) toast.error('Не удалось загрузить участников сервера');
            }
        };
        fetchMembers();
    }, [serverId]);

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <ChatAreaHeader
                channelName={channelName}
                onToggleMembers={() => setIsMembersOpen((prev) => !prev)}
            />

            <div className="flex flex-1 items-stretch overflow-hidden">
                <div className="flex h-full min-w-0 flex-1 flex-col bg-[#313338]">
                    <div className="discord-scroll flex flex-1 flex-col-reverse overflow-y-auto p-4">
                        {allMessages.map((msg, index) => (
                            <ChatAreaMessage
                                message={msg}
                                currentUserId={profile?.id}
                                onEdit={editMessage}
                                chatEndRef={index === 0 ? chatEndRef : undefined}
                                key={msg.id}
                            />
                        ))}
                    </div>

                    <TypingIndicator names={typingNames} />

                    <ChatInputForm
                        channelName={channelName}
                        isSending={isSending}
                        onSendMessage={sendMessage}
                        onTyping={sendTyping}
                    />
                </div>

                <MembersSheet
                    members={members}
                    open={isMembersOpen}
                    onOpenChange={setIsMembersOpen}
                />
            </div>
        </div>
    );
}
