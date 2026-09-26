'use client';

import { ConversationType } from '@backend/types/__generated__/enums';

import { useDirectChatMessages } from '../hooks/useDirectChatMessages';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import ActiveCallBanner from './ActiveCallBanner';
import ChatAreaMessage from './ChatAreaMessage';
import ChatInputForm from './ChatInputForm';
import DirectChatHeader from './DirectChatHeader';
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

    const { allMessages, sendMessage, editMessage, deleteMessage, isSending, chatEndRef } =
        useDirectChatMessages({
            conversationId,
        });

    return (
        <div className="flex h-full flex-1 flex-col bg-[#313338] text-white">
            <DirectChatHeader
                channelName={channelName}
                channelType={channelType}
                conversationId={conversationId}
                isOwner={isOwner}
                inCallMode={inCallMode}
                onStartCall={onStartCall}
            />

            <ActiveCallBanner inCallMode={inCallMode} onStartCall={onStartCall} />

            <div className="discord-scroll flex flex-1 flex-col-reverse overflow-y-auto p-4">
                {allMessages.map((msg, index) => (
                    <ChatAreaMessage
                        message={msg}
                        chatEndRef={index === 1 ? chatEndRef : undefined}
                        currentUserId={currentUserId}
                        onEdit={editMessage}
                        onDelete={deleteMessage}
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
    );
}
