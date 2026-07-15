import { Account, User } from '@backend/types/__generated__/client';
import { create } from 'zustand';

import { api } from '@/lib/api/api';

interface IAuthStore {
    profile: User | null;
    accounts: Account[];

    initUser: (user: User) => Promise<void>;
    refetchUser: () => Promise<void>;
    clearUser: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
    profile: null,
    accounts: [],
    initUser: async (user) => {
        const accountsResponse = await api.get('users/accounts');
        const accounts = (await accountsResponse.data) as Account[];

        set({ profile: user, accounts });
    },
    refetchUser: async () => {
        const profileResponse = await api.get('users/profile');
        const profile = (await profileResponse.data) as User;

        const accountsResponse = await api.get('users/accounts');
        const accounts = (await accountsResponse.data) as Account[];

        set({ profile, accounts });
    },
    clearUser: () => set({ profile: null, accounts: [] }),
}));
