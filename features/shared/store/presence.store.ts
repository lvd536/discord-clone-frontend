import { create } from 'zustand';

interface PresenceState {
    onlineUsers: Set<string>;
    setOnlineUsers: (ids: string[]) => void;
    userConnected: (id: string) => void;
    userDisconnected: (id: string) => void;

    checkUsersPresence: (userIds: string[]) => void;
    setCheckStatusFn: (fn: (userIds: string[]) => void) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    onlineUsers: new Set(),
    checkUsersPresence: () => {},

    setOnlineUsers: (ids) => set({ onlineUsers: new Set(ids) }),

    userConnected: (id) =>
        set((state) => ({
            onlineUsers: new Set(state.onlineUsers).add(id),
        })),

    userDisconnected: (id) =>
        set((state) => {
            const next = new Set(state.onlineUsers);
            next.delete(id);
            return { onlineUsers: next };
        }),

    setCheckStatusFn: (fn) => set({ checkUsersPresence: fn }),
}));
