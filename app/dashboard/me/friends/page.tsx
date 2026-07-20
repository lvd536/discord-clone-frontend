'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { User } from '@backend/types/__generated__/client';
import { Check, MessageSquare, UserMinus, Users, X } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';

import { getOrCreateDM } from '@/features/chat/actions';
import {
    acceptFriendRequest,
    getFriends,
    removeFriend,
    sendFriendRequest,
} from '@/features/friends/actions';

type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'ADD_FRIEND';

export default function FriendsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('ONLINE');
    const [friends, setFriends] = useState<User[]>([]);
    const [pendingRequests, setPendingRequests] = useState<User[]>([]);
    const [friendEmailInput, setFriendEmailInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (activeTab === 'ONLINE' || activeTab === 'ALL') {
                const res = await getFriends('ACCEPTED');
                if (res.success && res.data) setFriends(res.data);
            } else if (activeTab === 'PENDING') {
                const res = await getFriends('PENDING');
                if (res.success && res.data) setPendingRequests(res.data);
            }
        };
        loadData();
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
                router.push(`/dashboard/@me/${res.data.id}`);
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

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <div className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none">
                <div className="no-scrollbar flex items-center gap-4 overflow-x-auto">
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <Users className="h-5 w-5 text-[#80848e]" />
                        Друзья
                    </span>
                    <div className="h-4 w-px bg-[#3f4147]" />

                    <div className="flex items-center gap-2 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab('ONLINE')}
                            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                                activeTab === 'ONLINE'
                                    ? 'bg-[#3f4147] text-white'
                                    : 'text-[#b5bac1] hover:bg-[#35363c]'
                            }`}
                        >
                            В сети
                        </button>
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                                activeTab === 'ALL'
                                    ? 'bg-[#3f4147] text-white'
                                    : 'text-[#b5bac1] hover:bg-[#35363c]'
                            }`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setActiveTab('PENDING')}
                            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                                activeTab === 'PENDING'
                                    ? 'bg-[#3f4147] text-white'
                                    : 'text-[#b5bac1] hover:bg-[#35363c]'
                            }`}
                        >
                            Ожидание
                        </button>
                        <button
                            onClick={() => setActiveTab('ADD_FRIEND')}
                            className={`cursor-pointer rounded px-2 py-1 font-semibold transition-colors ${
                                activeTab === 'ADD_FRIEND'
                                    ? 'bg-transparent text-[#23a55a]'
                                    : 'bg-[#23a55a] text-white hover:bg-[#1a7f37]'
                            }`}
                        >
                            Добавить в друзья
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden md:grid md:grid-cols-3">
                <div className="flex h-full flex-1 flex-col overflow-hidden border-r border-[#1f2023]/30 md:col-span-2">
                    {activeTab !== 'ADD_FRIEND' ? (
                        <div className="flex flex-1 flex-col overflow-hidden p-6">
                            <div className="mb-4 shrink-0">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск по друзьям..."
                                    className="h-9 border-none bg-[#1e1f22] text-[#dbdee1] placeholder:text-[#4e5058] focus-visible:ring-0"
                                />
                            </div>

                            <div className="discord-scroll flex-1 space-y-2 overflow-y-auto">
                                {activeTab === 'PENDING' ? (
                                    pendingRequests.length > 0 ? (
                                        pendingRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className="group flex items-center justify-between rounded p-2.5 transition-all hover:bg-[#35363c]/40"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white">
                                                        {req.displayName.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white">
                                                            {req.displayName}
                                                        </span>
                                                        <span className="text-xs text-[#949ba4]">
                                                            Входящий запрос
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAcceptRequest(req.id)}
                                                        className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#23a55a] transition-colors hover:bg-[#23a55a] hover:text-white"
                                                        title="Принять запрос"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeclineOrRemove(req.id)
                                                        }
                                                        className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#f23f43] transition-colors hover:bg-[#f23f43] hover:text-white"
                                                        title="Отклонить запрос"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-10 text-center text-sm text-[#949ba4] italic">
                                            Нет входящих запросов
                                        </p>
                                    )
                                ) : filteredFriends.length > 0 ? (
                                    filteredFriends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            className="group flex items-center justify-between rounded p-2.5 transition-all hover:bg-[#35363c]/40"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white">
                                                    {friend.displayName.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">
                                                        {friend.displayName}
                                                    </span>
                                                    <span className="text-xs text-[#23a55a]">
                                                        В сети
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStartChat(friend.id)}
                                                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#f2f3f5]"
                                                    title="Написать сообщение"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineOrRemove(friend.id)}
                                                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#f23f43] transition-colors hover:bg-[#f23f43] hover:text-white"
                                                    title="Удалить из друзей"
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-10 text-center text-sm text-[#949ba4] italic">
                                        Список друзей пуст
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-6 p-6">
                            <div className="space-y-1">
                                <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                                    Добавить в друзья
                                </h2>
                                <p className="text-xs text-[#949ba4]">
                                    Вы можете добавить друга, введя его уникальный идентификатор
                                    пользователя (ID).
                                </p>
                            </div>

                            <form
                                onSubmit={handleAddFriend}
                                className="relative flex items-center rounded-lg border border-black/40 bg-[#1e1f22] px-4 py-3"
                            >
                                <input
                                    type="text"
                                    value={friendEmailInput}
                                    onChange={(e) => setFriendEmailInput(e.target.value)}
                                    placeholder="Введите ID пользователя (например: cmrkuqkbf0000p9sb53f0e5ea)"
                                    className="w-full bg-transparent text-sm text-[#dbdee1] placeholder-[#4e5058] focus:outline-none"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !friendEmailInput.trim()}
                                    className="absolute right-2 cursor-pointer rounded bg-[#5865f2] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4752c4] disabled:opacity-40"
                                >
                                    {loading ? 'Отправка...' : 'Отправить запрос'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="hidden flex-col border-l border-[#1f2023]/30 bg-[#313338] p-6 md:col-span-1 md:flex">
                    <h3 className="mb-4 text-sm font-bold text-white">Активные сейчас</h3>
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#3f4147]/40 p-4 text-center">
                        <p className="mb-1 text-sm font-bold text-[#f2f3f5]">Здесь пока тихо...</p>
                        <p className="text-xs text-[#949ba4]">
                            Когда друзья начнут играть или общаться в голосовых каналах, мы покажем
                            это здесь!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
