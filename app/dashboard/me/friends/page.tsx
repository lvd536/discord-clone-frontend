'use client';

import { useLayoutEffect } from 'react';

import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/features/auth/store/auth.store';
import {
    FriendCard,
    FriendsActivities,
    FriendsAddTab,
    FriendsTabs,
    PendingRequest,
} from '@/features/friends/components';
import useFriends from '@/features/friends/hooks';
import { usePresenceStore } from '@/features/shared/store/presence.store';

export default function FriendsPage() {
    const checkUsersPresence = usePresenceStore((state) => state.checkUsersPresence);
    const profile = useAuthStore((s) => s.profile);
    const {
        activeTab,
        friendEmailInput,
        friends,
        handleAcceptRequest,
        handleAddFriend,
        handleDeclineOrRemove,
        handleStartChat,
        loading,
        pendingRequests,
        searchQuery,
        setActiveTab,
        setFriendEmailInput,
        setSearchQuery,
    } = useFriends(profile?.displayName);

    useLayoutEffect(() => {
        if (!friends || friends.length === 0) return;

        const targetFriendsIds: string[] = friends.map((f) => f.id);

        if (targetFriendsIds.length > 0) {
            checkUsersPresence(targetFriendsIds);
        }
    }, [friends, checkUsersPresence]);

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#313338] text-white">
            <FriendsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
                                            <PendingRequest
                                                displayName={req.displayName}
                                                acceptRequest={() => handleAcceptRequest(req.id)}
                                                declineOrRemove={() =>
                                                    handleDeclineOrRemove(req.id)
                                                }
                                                key={req.id}
                                            />
                                        ))
                                    ) : (
                                        <p className="py-10 text-center text-sm text-[#949ba4] italic">
                                            Нет входящих запросов
                                        </p>
                                    )
                                ) : friends.length > 0 ? (
                                    friends.map((friend) => (
                                        <FriendCard
                                            friend={friend}
                                            handleDeclineOrRemove={handleDeclineOrRemove}
                                            handleStartChat={handleStartChat}
                                            hideOffline={activeTab === 'ONLINE'}
                                            key={friend.id}
                                        />
                                    ))
                                ) : (
                                    <p className="py-10 text-center text-sm text-[#949ba4] italic">
                                        Список друзей пуст
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <FriendsAddTab
                            friendEmailInput={friendEmailInput}
                            handleAddFriend={handleAddFriend}
                            loading={loading}
                            setFriendEmailInput={setFriendEmailInput}
                        />
                    )}
                </div>

                <FriendsActivities />
            </div>
        </div>
    );
}
