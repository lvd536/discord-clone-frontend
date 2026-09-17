'use client';

import { useEffect } from 'react';

import { usePresenceStore } from '@/features/shared/store/presence.store';

import { UserConversationsType } from '../types/direct-chat.types';
import DirectChat from './DirectChat';

interface IProps {
    conversations: UserConversationsType;
    currentUserId: string;
}

export default function ConversationsList({ conversations, currentUserId }: IProps) {
    const checkUsersPresence = usePresenceStore((state) => state.checkUsersPresence);

    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const targetUserIds: string[] = [];

        conversations.forEach((conv) => {
            if (conv.type === 'DIRECT') {
                const other = conv.participants.find((p) => p.user.id !== currentUserId);
                if (other) targetUserIds.push(other.user.id);
            }
        });

        if (targetUserIds.length > 0) {
            checkUsersPresence(targetUserIds);
        }
    }, [conversations, currentUserId, checkUsersPresence]);

    return (
        <ul className="discord-scroll mt-1 space-y-0.5">
            {conversations.map((conversation) => (
                <DirectChat
                    conversation={conversation}
                    userId={currentUserId}
                    key={conversation.id}
                />
            ))}
        </ul>
    );
}
