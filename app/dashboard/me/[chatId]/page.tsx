import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/actions';
import { getUserConversations } from '@/features/direct-chat/actions';
import { joinChannel } from '@/features/shared/actions';
import DirectTextChannel from "@/features/text/components/DirectTextChannel";

interface IProps {
    params: Promise<{ chatId: string }>;
}

export default async function PrivateMessagesPage({ params }: IProps) {
    const { chatId } = await params;

    const [userResponse, conversationsResponse] = await Promise.all([
        getProfile(),
        getUserConversations(),
    ]);

    const user = userResponse.success ? userResponse.data : null;
    const conversations = conversationsResponse.success ? conversationsResponse.data : [];

    if (!user) return redirect('/auth/login');

    const currentChat = conversations.find((c) => c.id === chatId);

    if (!currentChat) {
        return (
            <div className="flex flex-1 items-center justify-center bg-[#313338] text-white">
                Диалог не найден или у вас нет к нему доступа
            </div>
        );
    }

    const otherParticipant = currentChat.participants.find((p) => p.user.id !== user.id)?.user;
    const chatName =
        currentChat.type === 'DIRECT'
            ? (otherParticipant?.displayName ?? otherParticipant?.email)
            : currentChat.name;

    let token = '';
    try {
        const tokenResponse = await joinChannel({ channelId: chatId });
        if (tokenResponse.success) token = tokenResponse.data.token;
    } catch (error) {
        console.error('Ошибка получения LiveKit-токена для личного чата:', error);
        return (
            <div className="flex flex-1 items-center justify-center bg-[#313338] text-white">
                Ошибка голосового сервера. Пожалуйста, попробуйте позже.
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338]">
            <DirectTextChannel
                channelId={chatId}
                accessToken={token}
                channelName={chatName || 'Личная переписка'}
                channelType={currentChat.type}
                isOwner={user.id === currentChat.ownerId}
                currentUserId={user.id}
                currentUsername={user.displayName}
            />
        </div>
    );
}
