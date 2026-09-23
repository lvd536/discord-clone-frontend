import { create } from 'zustand';

import { SendNotificationDto } from '../types/notification.types';

interface NotificationState {
    unreadChannels: Record<string, number>;
    unreadServers: Set<string>;
    pendingFriendRequests: number;

    addUnreadMessage: (channelId: string, serverId?: string) => void;
    clearUnreadChannel: (channelId: string, serverId?: string) => void;
    incrementFriendRequests: () => void;
    clearFriendRequests: () => void;
    setPendingRequestsCount: (count: number) => void;

    sendNotification: (dto: SendNotificationDto) => void;
    setSendNotificationFn: (fn: (dto: SendNotificationDto) => void) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    unreadChannels: {},
    unreadServers: new Set(),
    pendingFriendRequests: 0,
    sendNotification: () => {},

    addUnreadMessage: (channelId, serverId) =>
        set((state) => {
            const currentCount = state.unreadChannels[channelId] || 0;
            const nextChannels = { ...state.unreadChannels, [channelId]: currentCount + 1 };

            const nextServers = new Set(state.unreadServers);
            if (serverId) {
                nextServers.add(serverId);
            }

            return {
                unreadChannels: nextChannels,
                unreadServers: nextServers,
            };
        }),

    clearUnreadChannel: (channelId, serverId) =>
        set((state) => {
            const nextChannels = { ...state.unreadChannels };
            delete nextChannels[channelId];

            const nextServers = new Set(state.unreadServers);
            if (serverId) {
                nextServers.delete(serverId);
            }

            return {
                unreadChannels: nextChannels,
                unreadServers: nextServers,
            };
        }),

    incrementFriendRequests: () =>
        set((state) => ({ pendingFriendRequests: state.pendingFriendRequests + 1 })),

    clearFriendRequests: () => set({ pendingFriendRequests: 0 }),

    setPendingRequestsCount: (count) => set({ pendingFriendRequests: count }),

    setSendNotificationFn: (fn) => set({ sendNotification: fn }),
}));
