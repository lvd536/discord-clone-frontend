'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { getOrCreateDM } from '@/features/direct-chat/actions';
import { sendFriendRequest } from '@/features/friends/actions';
import { getErrorMessage } from '@/lib/errors';

interface UserInfo {
    id: string;
    displayName: string;
}

export function useUserPopoverActions(user: UserInfo, onChatOpened?: () => void) {
    const router = useRouter();
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const handleStartDirectChat = async () => {
        setIsChatLoading(true);
        try {
            const res = await getOrCreateDM(user.id);
            if (res.success && res.data) {
                onChatOpened?.();
                router.push(`/dashboard/@me/${res.data.id}`);
            }
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleAddFriend = async () => {
        try {
            const res = await sendFriendRequest(user.id);
            if (res.success) {
                setRequestSent(true);
                toast.success('Запрос в друзья отправлен!');
            } else {
                toast.error(res.error || 'Не удалось отправить запрос');
            }
        } catch {
            toast.error('Произошла ошибка при отправке запроса');
        }
    };

    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        toast.success(`ID пользователя ${user.displayName} скопирован!`);
        setTimeout(() => setCopied(false), 2000);
    };

    return {
        isChatLoading,
        copied,
        requestSent,
        handleStartDirectChat,
        handleAddFriend,
        handleCopyId,
    };
}
