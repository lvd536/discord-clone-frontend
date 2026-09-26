import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { User } from '@backend/types/__generated__/client';
import { toast } from 'sonner';

import { getOrCreateDM } from '@/features/direct-chat/actions';
import { useNotificationStore } from '@/features/notifications/store/notification.store';
import { NOTIFICATION_TYPE } from '@/features/notifications/types/notification.types';
import { ROUTES } from '@/features/shared/constants/route.constants';

import { acceptFriendRequest, getFriends, removeFriend, sendFriendRequest } from '../actions';
import { TabType } from '../types/tab.types';

export default function useFriends(displayName?: string) {
    const router = useRouter();
    const sendNotification = useNotificationStore((s) => s.sendNotification);
    const [activeTab, setActiveTab] = useState<TabType>('ONLINE');
    const [friends, setFriends] = useState<User[]>([]);
    const [pendingRequests, setPendingRequests] = useState<User[]>([]);
    const [friendEmailInput, setFriendEmailInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (activeTab === 'ONLINE' || activeTab === 'ALL') {
                const res = await getFriends('ACCEPTED');
                if (res.success && res.data && isMounted) {
                    setFriends(res.data);
                }
            } else if (activeTab === 'PENDING') {
                const res = await getFriends('PENDING');
                if (res.success && res.data && isMounted) {
                    setPendingRequests(res.data);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [activeTab]);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        const target = friendEmailInput.trim();
        if (!target || loading) return;

        setLoading(true);
        try {
            const res = await sendFriendRequest(target);
            if (res.success) {
                toast.success('Запрос в друзья успешно отправлен!');
                setFriendEmailInput('');
                sendNotification({
                    channelId: `users:${target}`,
                    message: `${displayName || 'Пользователь'} отправил заявку в друзья!`,
                    type: NOTIFICATION_TYPE.FRIENDSHIP_REQUEST,
                });
            } else {
                throw new Error(res.error);
            }
        } catch (err) {
            if (err instanceof Error) toast.error(err.message || 'Не удалось отправить запрос');
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async (friendId: string) => {
        try {
            const res = await getOrCreateDM(friendId);
            if (res.success && res.data) {
                router.refresh();
                router.push(ROUTES.DASHBOARD.ME.ID(res.data.id));
            }
        } catch {
            toast.error('Не удалось открыть диалог');
        }
    };

    const handleAcceptRequest = async (requesterId: string) => {
        try {
            const res = await acceptFriendRequest(requesterId);
            if (res.success) {
                toast.success('Запрос принят!');
                setPendingRequests((prev) => prev.filter((u) => u.id !== requesterId));
                sendNotification({
                    channelId: `users:${requesterId}`,
                    message: `${displayName || 'Пользователь'} принял ваш запрос в друзья!`,
                    type: NOTIFICATION_TYPE.FRIENDSHIP_ACCEPT,
                });
            }
        } catch {
            toast.error('Ошибка принятия запроса');
        }
    };

    const handleDeclineOrRemove = async (targetId: string) => {
        try {
            const res = await removeFriend(targetId);
            if (res.success) {
                toast.success('Успешно удалено');
                setFriends((prev) => prev.filter((u) => u.id !== targetId));
                setPendingRequests((prev) => prev.filter((u) => u.id !== targetId));
            }
        } catch {
            toast.error('Ошибка выполнения операции');
        }
    };

    const filteredFriends = friends.filter(
        (f) =>
            f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return {
        activeTab,
        setActiveTab,
        friends: filteredFriends,
        pendingRequests,
        friendEmailInput,
        setFriendEmailInput,
        searchQuery,
        setSearchQuery,
        loading,
        handleAddFriend,
        handleStartChat,
        handleAcceptRequest,
        handleDeclineOrRemove,
        sendNotification,
    };
}
