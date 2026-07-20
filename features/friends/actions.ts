'use server';

import { Friendship, FriendshipStatus, User } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

export const getFriends = createSafeAction(async (status?: FriendshipStatus) => {
    const response = await api.get('/friends', {
        params: status ? { status } : {},
    });
    return response.data as User[];
});

export const sendFriendRequest = createSafeAction(async (friendId: string) => {
    const response = await api.post(`/friends/request/${friendId}`);
    return response.data as Friendship;
});

export const acceptFriendRequest = createSafeAction(async (requesterId: string) => {
    const response = await api.post(`/friends/accept/${requesterId}`);
    return response.data as Friendship;
});

export const removeFriend = createSafeAction(async (targetId: string) => {
    const response = await api.delete(`/friends/${targetId}`);
    return response.data as Friendship;
});
